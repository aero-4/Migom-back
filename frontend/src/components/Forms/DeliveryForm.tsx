import React, {useCallback, useEffect, useState} from "react";
import closeSvg from "../../assets/close.svg";
import PaymentForm from "./PaymentForm.tsx";
import BackButton from "../Ui/BackButton.tsx";
import ToggleSwitch from "../Ui/ToggleSwitch.tsx";
import Loader from "../Loaders/Loader.tsx";
import CloseButton from "../Ui/CloseButton.tsx";

export type DeliveryAddress = {
    id?: number;
    addressLine?: string;
    street?: string;
    house?: string;
    flat?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
    leaveAtDoor?: boolean;
};

type Step = "cart" | "address" | "payment";

type Props = {
    value?: DeliveryAddress;
    onChange?: (addr: DeliveryAddress) => void;
    onSubmit?: (addr: DeliveryAddress) => Promise<void> | void;
    step: Step;
    setStep: (s: Step) => void;
    onClose?: () => void;
    submitLabel?: string;
    className?: string;
};

type Errors = Partial<Record<keyof DeliveryAddress, string | null>>;


const NO_VALUES = new Set([
    "нет",
    "no",
    "none",
    "-",
    "n",
    "нету",
    "нет ",
    "нету ",
    "none ",
]);

const isNoValue = (raw?: string) => {
    if (!raw) return false;
    return NO_VALUES.has(raw.trim().toLowerCase());
};

const onlyDigits = (s?: string) => {
    if (!s) return false;
    return /^\d+$/.test(s.trim());
};


const DeliveryForm: React.FC<Props> = ({
                                           value,
                                           onChange,
                                           onSubmit,
                                           step,
                                           setStep,
                                           onClose,
                                           submitLabel = "Оплатить",
                                           className = "",
                                       }) => {
    const [addr, setAddr] = useState<DeliveryAddress>(() => value ?? {leaveAtDoor: false});
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    // NEW: список адресов и статусы
    const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const alphaRegex = /^[\p{L}\s\-]+$/u;
    const numericRegex = /^\d+$/;

    // Fetch addresses helper (used on mount and after create/update/delete)
    const fetchAddresses = useCallback(async (signal?: AbortSignal) => {
        setLoadingAddresses(true);
        try {
            const res = await fetch("/api/addresses/", {signal});
            if (!res.ok) {
                setAddresses([]);
                return;
            }
            const list = await res.json();
            if (!Array.isArray(list)) {
                setAddresses([]);
                return;
            }
            const mapped: DeliveryAddress[] = list.map((last: any) => ({
                id: last.id,
                addressLine: last.city ?? "",
                street: last.street ?? "",
                house: last.house_number != null ? String(last.house_number) : "",
                flat: last.apartment_number != null ? String(last.apartment_number) : "",
                floor: last.floor != null ? String(last.floor) : "",
                intercom: last.entrance != null ? String(last.entrance) : "",
                comment: last.comment ?? "",
                leaveAtDoor: !!last.is_leave_at_door,
            }));
            setAddresses(mapped);
        } catch (e) {
            if ((e as any)?.name === "AbortError") return;
            console.error("Failed to fetch addresses", e);
            setAddresses([]);
        } finally {
            setLoadingAddresses(false);
        }
    }, []);

    useEffect(() => {
        const ctrl = new AbortController();
        fetchAddresses(ctrl.signal);
        return () => ctrl.abort();
    }, [fetchAddresses]);

    // If parent passed value, reflect it
    useEffect(() => {
        if (value) {
            setAddr(value);
        }
    }, [value]);

    const genUuid = (): string => {
        if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
            return (crypto as any).randomUUID();
        }
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    };
    const normalize = (arr: any[]) =>
        arr.map((p) => ({
            ...p,
            id: p.id && String(p.id).trim() ? p.id : genUuid(),
            name: p.name ?? p.slug ?? "Без имени",
            photo: p.photo ?? p.image ?? "",
            count: typeof p.count === "number" ? p.count : Number(p.count ?? 0),
            price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
            gramme: typeof p.gramme === "number" ? p.gramme : Number(p.gramme ?? 0),
        }));

    const update = useCallback(
        (patch: Partial<DeliveryAddress>) => {
            setAddr((prev) => {
                const next = {...prev, ...patch};
                onChange?.(next);
                return next;
            });

            for (const k of Object.keys(patch) as (keyof DeliveryAddress)[]) {
                const v = (patch as any)[k];
                const err = validateField(k, v ?? (addr as any)[k]);
                setErrors((prev) => ({...prev, [k]: err}));
            }
        },
        [onChange, addr]
    );

    const validateField = (field: keyof DeliveryAddress, value?: any): string | null => {
        const raw = typeof value === "string" ? value.trim() : value;

        switch (field) {
            case "addressLine":
            case "street": {
                if (!raw) return "Поле обязательно";
                if (!alphaRegex.test(raw)) return "Только буквы, пробелы и дефис";
                return null;
            }

            case "house": {
                if (!raw) return null;
                if (!numericRegex.test(String(raw))) return "Только цифры";
                return null;
            }
            case "flat":
            case "floor": {
                if (!raw) return null;
                if (!numericRegex.test(String(raw))) return "Только цифры";
                return null;
            }

            case "intercom": {
                if (!raw) return null;
                if (isNoValue(String(raw))) return null;
                if (!onlyDigits(String(raw))) return 'Только цифры или "нет"';
                return null;
            }

            case "comment":
            case "leaveAtDoor":
                return null;

            default:
                return null;
        }
    };

    const validateAll = (): boolean => {
        const next: Errors = {};

        const required: (keyof DeliveryAddress)[] = ["addressLine", "street"];
        required.forEach((f) => {
            const err = validateField(f, (addr as any)[f]);
            if (err) next[f] = err;
        });

        const numeric: (keyof DeliveryAddress)[] = ["house", "flat", "floor", "intercom"];
        numeric.forEach((f) => {
            const err = validateField(f, (addr as any)[f]);
            if (err) next[f] = err;
        });

        setErrors(next);
        return Object.keys(next).length === 0;
    };


    const buildCreateDTO = (a: DeliveryAddress) => {
        const entrance =
            !a.intercom || isNoValue(a.intercom) ? null : a.intercom ? Number(a.intercom) : null;

        return {
            city: a.addressLine ?? "",
            street: a.street ?? "",
            house_number: a.house ? Number(a.house) : null,
            entrance: entrance,
            floor: a.floor ? Number(a.floor) : null,
            apartment_number: a.flat ? Number(a.flat) : null,
            comment: a.comment ?? null,
            is_leave_at_door: a.leaveAtDoor ?? null,
        };
    };

    const buildUpdateDTO = (a: DeliveryAddress) => {
        const entrance =
            !a.intercom || isNoValue(a.intercom) ? null : a.intercom ? Number(a.intercom) : null;

        return {
            id: a.id ?? null,
            city: a.addressLine ?? null,
            street: a.street ?? null,
            house_number: a.house ? Number(a.house) : null,
            entrance: entrance,
            floor: a.floor ? Number(a.floor) : null,
            apartment_number: a.flat ? Number(a.flat) : null,
            comment: a.comment ?? null,
            is_leave_at_door: a.leaveAtDoor ?? null,
        };
    };

    const handleAddressSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!validateAll()) return;

        setLoadingSubmit(true);
        try {
            if (!addr.id) {
                const body = buildCreateDTO(addr);
                const res = await fetch("/api/addresses/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                });
                if (!res.ok) {
                    let message = `Ошибка создания адреса: ${res.status}`;
                    try {
                        const json = await res.json();
                        message = json?.detail || json?.message || message;
                    } catch {
                        // ignore
                    }
                    throw new Error(message);
                }
                const created = await res.json();
                setAddr((prev) => ({...prev, id: created.id}));
                // refresh addresses and select created
                await fetchAddresses();
            } else {
                const body = buildUpdateDTO(addr);
                const res = await fetch(`/api/addresses/${addr.id}`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                });
                if (!res.ok) {
                    let message = `Ошибка обновления адреса: ${res.status}`;
                    try {
                        const json = await res.json();
                        message = json?.detail || json?.message || message;
                    } catch {
                        // ignore
                    }
                    throw new Error(message);
                }
                // refresh addresses
                await fetchAddresses();
            }

            setStep("payment");
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubmit(false);
        }
    };


    const onBlurValidate = (field: keyof DeliveryAddress) => {
        const err = validateField(field, (addr as any)[field]);
        setErrors((prev) => ({...prev, [field]: err}));
    };

    // NEW: select an address from list (checkbox behaviour but only one selected)
    const selectAddress = (a: DeliveryAddress) => {
        setAddr(a);
        onChange?.(a);
    };

    const startEdit = (a: DeliveryAddress) => {
        setAddr(a);
        onChange?.(a);
    };

    const startCreate = () => {
        setAddr({leaveAtDoor: false});
        onChange?.({leaveAtDoor: false});
    };

    const handleDeleteAddress = async (id?: number) => {
        if (!id) return;
        if (!confirm("Удалить этот адрес?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/addresses/${id}`, {method: "DELETE"});
            if (!res.ok) {
                throw new Error(`Ошибка удаления: ${res.status}`);
            }
            // если удалили выбранный адрес — очистим addr
            if (addr.id === id) {
                setAddr({leaveAtDoor: false});
                onChange?.({leaveAtDoor: false});
            }
            await fetchAddresses();
        } catch (e) {
            console.error(e);
            alert("Не удалось удалить адрес");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={`w-full h-full ${className}`}>
            {step === "address" ? (
                <form
                    onSubmit={handleAddressSubmit}
                    className="h-full flex flex-col  bg-white rounded-xl text-base"
                >
                    <div className="flex items-center justify-between p-3">
                        <h3 className="font-semibold text-2xl">Адрес доставки</h3>
                        <CloseButton close={onClose}/>
                    </div>

                    <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 space-y-3">
                        {/* --- NEW: Addresses list with checkbox-like selection --- */}
                        <div className="bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">Выберите адрес</div>
                                {/* TOP "Добавить новый" big__button */}
                                <button
                                    type="button"
                                    onClick={startCreate}
                                    className="big__button text-sm"
                                >
                                    + Добавить новый
                                </button>
                            </div>

                            {loadingAddresses ? (
                                <div className="text-sm text-gray-500">Загрузка адресов...</div>
                            ) : addresses.length === 0 ? (
                                <div className="text-sm text-gray-500">Адресов нет</div>
                            ) : (
                                <div className="grid gap-2">
                                    {addresses.map((a) => (
                                        <label key={String(a.id)} className="flex items-start gap-3 p-2 border rounded">
                                            <input
                                                type="checkbox"
                                                checked={addr.id === a.id}
                                                onChange={() => selectAddress(a)} /* поведение: сделать выбранным (единственным) */
                                                className="mt-1"
                                            />
                                            <div className="flex-1 text-sm">
                                                <div className="font-medium">
                                                    {a.addressLine} {a.street ? `, ${a.street}` : ""} {a.house ? `д. ${a.house}` : ""}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {a.flat ? `Кв. ${a.flat}` : ""} {a.floor ? `, этаж ${a.floor}` : ""} {a.intercom ? `, домофон ${a.intercom}` : ""}
                                                </div>
                                                {a.comment ? <div className="text-xs text-gray-400 mt-1">{a.comment}</div> : null}
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(a)}
                                                    className="text-xs text-blue-600"
                                                >
                                                    Ред.
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={deletingId === a.id}
                                                    onClick={() => handleDeleteAddress(a.id)}
                                                    className="text-xs text-red-600"
                                                >
                                                    {deletingId === a.id ? "Удаление..." : "Удалить"}
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- BOTTOM "Добавить новый" big__button (над формой полей) --- */}
                        <div className="flex justify-center">
                            <button type="button" onClick={startCreate} className="big__button w-full max-w-xs">
                                + Добавить новый
                            </button>
                        </div>

                        {/* --- Existing inline form fields (you already had these) --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="sr-only" htmlFor="city">
                                    Город
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={addr.addressLine ?? ""}
                                    onChange={(e) => update({addressLine: e.target.value})}
                                    onBlur={() => onBlurValidate("addressLine")}
                                    placeholder="Город"
                                    className={`input text-sm sm:text-base ${errors.addressLine ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.addressLine}
                                />
                                {errors.addressLine ? (
                                    <div className="text-xs text-red-600 mt-1">{errors.addressLine}</div>
                                ) : null}
                            </div>

                            <div>
                                <label className="sr-only" htmlFor="street">
                                    Улица
                                </label>
                                <input
                                    id="street"
                                    name="street"
                                    type="text"
                                    value={addr.street ?? ""}
                                    onChange={(e) => update({street: e.target.value})}
                                    onBlur={() => onBlurValidate("street")}
                                    placeholder="Улица"
                                    className={`input text-sm sm:text-base ${errors.street ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.street}
                                />
                                {errors.street ? <div className="text-xs text-red-600 mt-1">{errors.street}</div> : null}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="sr-only" htmlFor="house">
                                    Номер дома
                                </label>
                                <input
                                    id="house"
                                    name="house"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.house ?? ""}
                                    onChange={(e) => update({house: e.target.value.replace(/[^\d]/g, "")})}
                                    onBlur={() => onBlurValidate("house")}
                                    placeholder="Номер дома"
                                    className={`input text-sm sm:text-base ${errors.house ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.house}
                                />
                                {errors.house ? <div className="text-xs text-red-600 mt-1">{errors.house}</div> : null}
                            </div>

                            <div>
                                <label className="sr-only" htmlFor="flat">
                                    Номер квартиры
                                </label>
                                <input
                                    id="flat"
                                    name="flat"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.flat ?? ""}
                                    onChange={(e) => update({flat: e.target.value.replace(/[^\d]/g, "")})}
                                    onBlur={() => onBlurValidate("flat")}
                                    placeholder="Номер квартиры"
                                    className={`input text-sm sm:text-base ${errors.flat ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.flat}
                                />
                                {errors.flat ? <div className="text-xs text-red-600 mt-1">{errors.flat}</div> : null}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="sr-only" htmlFor="intercom">
                                    Домофон
                                </label>
                                <input
                                    id="intercom"
                                    name="intercom"
                                    type="text"
                                    value={addr.intercom ?? ""}
                                    onChange={(e) => update({intercom: e.target.value})}
                                    onBlur={() => onBlurValidate("intercom")}
                                    placeholder='Домофон (цифра или "нет")'
                                    className={`input text-sm sm:text-base ${errors.intercom ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.intercom}
                                />
                                {errors.intercom ? <div className="text-xs text-red-600 mt-1">{errors.intercom}</div> : null}
                            </div>

                            <div>
                                <label className="sr-only" htmlFor="floor">
                                    Этаж
                                </label>
                                <input
                                    id="floor"
                                    name="floor"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.floor ?? ""}
                                    onChange={(e) => update({floor: e.target.value.replace(/[^\d]/g, "")})}
                                    onBlur={() => onBlurValidate("floor")}
                                    placeholder="Этаж"
                                    className={`input text-sm sm:text-base ${errors.floor ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.floor}
                                />
                                {errors.floor ? <div className="text-xs text-red-600 mt-1">{errors.floor}</div> : null}
                            </div>
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="comment">
                                Комментарий
                            </label>
                            <input
                                id="comment"
                                name="comment"
                                type="text"
                                value={addr.comment ?? ""}
                                onChange={(e) => update({comment: e.target.value})}
                                placeholder="Комментарий для курьера"
                                className="input text-sm sm:text-base min-h-30"
                            />
                        </div>

                        <ToggleSwitch
                            checked={!!addr.leaveAtDoor}
                            onCheckedChange={(v) => update({leaveAtDoor: v})}
                            label="Оставить у двери"
                        />

                        <div className="h-24 md:h-28" aria-hidden/>
                    </div>

                    <div className="sticky bottom-0 bg-white p-2 sm:p-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loadingSubmit}
                            className={`big__button btn__circle w-full ${loadingSubmit ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            Далее
                        </button>

                        <BackButton onBack={() => setStep("cart")}/>
                    </div>
                </form>
            ) : (
                <PaymentForm addr={addr}
                             onSubmit={onSubmit}
                             submitLabel={submitLabel}
                             onBack={() => setStep("address")}/>
            )}

            { (loadingFetch || loadingAddresses) && (<Loader/>)}
        </div>
    );
};

export default DeliveryForm;
