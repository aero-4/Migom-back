import React, {useState} from "react";
import closeSvg from "../../assets/close.svg";
import PaymentForm from "./PaymentForm.tsx";
import BackButton from "../Ui/BackButton.tsx";
import ToggleSwitch from "../Ui/ToggleSwitch.tsx";

export type DeliveryAddress = {
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

type Errors = Partial<Record<keyof DeliveryAddress, string>>;

export const DeliveryForm: React.FC<Props> = ({
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
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const alphaRegex = /^[\p{L}\s\-]+$/u;
    const numericRegex = /^\d+$/;

    const update = (patch: Partial<DeliveryAddress>) => {
        const next = {...addr, ...patch};
        setAddr(next);
        onChange?.(next);
        for (const key of Object.keys(patch) as (keyof DeliveryAddress)[]) {
            validateField(key, (next as any)[key]);
        }
    };

    const validateField = (field: keyof DeliveryAddress, value?: any): string | null => {
        const str = typeof value === "string" ? value.trim() : value;

        switch (field) {
            case "addressLine":
            case "street": {
                if (!str) return "Поле обязательно";
                if (!alphaRegex.test(str)) return "Только буквы, пробелы и дефис";
                return null;
            }
            case "house":
            case "flat":
            case "floor":
            case "intercom": {
                if (!str) return null; // необязательно
                if (!numericRegex.test(str)) return "Только цифры";
                return null;
            }
            case "comment": {
                return null;
            }
            case "leaveAtDoor": {
                return null;
            }
            default:
                return null;
        }
    };

    const validateAll = (): boolean => {
        const nextErrors: Errors = {};
        const requiredFields: (keyof DeliveryAddress)[] = ["addressLine", "street"];
        requiredFields.forEach((f) => {
            const err = validateField(f, (addr as any)[f]);
            if (err) nextErrors[f] = err;
        });

        const numericFields: (keyof DeliveryAddress)[] = ["house", "flat", "floor", "intercom"];
        numericFields.forEach((f) => {
            const err = validateField(f, (addr as any)[f]);
            if (err) nextErrors[f] = err;
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleAddressSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const ok = validateAll();
        if (!ok) return;

        setLoading(true);
        try {
            setStep("payment");
        } finally {
            setLoading(false);
        }
    };

    const FieldError: React.FC<{ field: keyof DeliveryAddress }> = ({field}) => {
        const err = errors[field];
        if (!err) return null;
        return <div className="text-sm text-red-600 mt-1">{err}</div>;
    };

    return (
        <div className={`w-full h-full p-6 ${className}`}>
            {step === "address" ? (
                <form onSubmit={handleAddressSubmit} className="text-xl xl:text-2xl flex flex-col bg-white rounded-xl">
                    <div className="flex items-center justify-between">
                        <h3 className=" font-semibold ">Адрес доставки</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Закрыть корзину"
                            className="p-6 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2"
                        >
                            <img className="w-4 h-4" src={closeSvg} alt=""/>
                        </button>
                    </div>

                    <div className="space-y-3 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="text"
                                    value={addr.addressLine ?? ""}
                                    onChange={(e) => update({addressLine: e.target.value})}
                                    onBlur={() => validateField("addressLine", addr.addressLine)}
                                    placeholder="Город"
                                    className={`input ${errors.addressLine ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.addressLine}
                                />
                                <FieldError field="addressLine"/>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={addr.street ?? ""}
                                    onChange={(e) => update({street: e.target.value})}
                                    onBlur={() => validateField("street", addr.street)}
                                    placeholder="Улица"
                                    className={`input ${errors.street ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.street}
                                />
                                <FieldError field="street"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.house ?? ""}
                                    onChange={(e) => {
                                        // удаляем все не-цифры при вводе — удобный UX
                                        const sanitized = e.target.value.replace(/[^\d]/g, "");
                                        update({house: sanitized});
                                    }}
                                    placeholder="Номер дома"
                                    className={`input ${errors.house ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.house}
                                />
                                <FieldError field="house"/>
                            </div>

                            <div>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.flat ?? ""}
                                    onChange={(e) => update({flat: e.target.value.replace(/[^\d]/g, "")})}
                                    placeholder="Номер квартиры"
                                    className={`input ${errors.flat ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.flat}
                                />
                                <FieldError field="flat"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.intercom ?? ""}
                                    onChange={(e) => update({intercom: e.target.value.replace(/[^\d]/g, "")})}
                                    placeholder="Подъезд / домофон"
                                    className={`input ${errors.intercom ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.intercom}
                                />
                                <FieldError field="intercom"/>
                            </div>

                            <div>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    type="text"
                                    value={addr.floor ?? ""}
                                    onChange={(e) => update({floor: e.target.value.replace(/[^\d]/g, "")})}
                                    placeholder="Этаж"
                                    className={`input ${errors.floor ? "border-red-300" : ""}`}
                                    aria-invalid={!!errors.floor}
                                />
                                <FieldError field="floor"/>
                            </div>

                        </div>

                        <input
                            type="text"
                            value={addr.comment ?? ""}
                            onChange={(e) => update({comment: e.target.value})}
                            placeholder="Комментарий для курьера"
                            className="input min-h-30"
                        />

                        <ToggleSwitch
                            checked={!!addr.leaveAtDoor}
                            onCheckedChange={(v) => update({leaveAtDoor: v})}
                            label="Оставить у двери"
                        />

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`big__button btn__circle ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                Далее
                            </button>

                            <BackButton onBack={() => setStep("cart")}/>
                        </div>
                    </div>
                </form>
            ) : (
                <PaymentForm
                    addr={addr}
                    onSubmit={onSubmit}
                    submitLabel={submitLabel}
                    onBack={() => setStep("address")}
                />
            )}
        </div>
    );
};

export default DeliveryForm;
