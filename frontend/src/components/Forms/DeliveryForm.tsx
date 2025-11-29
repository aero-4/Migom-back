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

    const alphaRegex = /^[\p{L}\s\-]+$/u;
    const numericRegex = /^\d+$/;

    useEffect(() => {
        const ctrl = new AbortController();
        const load = async () => {
            setLoadingFetch(true);
            try {
                const res = await fetch("/api/addresses/", {signal: ctrl.signal});
                if (!res.ok) {
                    return;
                }
                const list = await res.json();
                if (!Array.isArray(list) || list.length === 0) return;

                const last = list[list.length - 1];

                const mapped: DeliveryAddress = {
                    id: last.id,
                    addressLine: last.city ?? "",
                    street: last.street ?? "",
                    house: last.house_number != null ? String(last.house_number) : "",
                    flat: last.apartment_number != null ? String(last.apartment_number) : "",
                    floor: last.floor != null ? String(last.floor) : "",
                    intercom: last.entrance != null ? String(last.entrance) : "",
                    comment: last.comment ?? "",
                    leaveAtDoor: !!last.is_leave_at_door,
                };

                setAddr(mapped);
                onChange?.(mapped);
            } catch (e) {
                if ((e as any)?.name === "AbortError") return;
                console.error("Failed to fetch addresses", e);
            } finally {
                setLoadingFetch(false);
            }
        };

        load();
        return () => ctrl.abort();
    }, []);


    const update = useCallback(
        (patch: Partial<DeliveryAddress>) => {
            setAddr((prev) => {
                const next = {...prev, ...patch};
                onChange?.(next);
                return next;
            });

            // validate changed fields
            for (const k of Object.keys(patch) as (keyof DeliveryAddress)[]) {
                const v = (patch as any)[k];
                const err = validateField(k, v ?? (addr as any)[k]);
                setErrors((prev) => ({...prev, [k]: err}));
            }
        },
        [onChange]
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

            case "house":
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
                <PaymentForm addr={addr} onSubmit={onSubmit} submitLabel={submitLabel} onBack={() => setStep("address")}/>
            )}

            {loadingFetch && (<Loader/>)}
        </div>
    );
};

export default DeliveryForm;
