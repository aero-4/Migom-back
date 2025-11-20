import React, { useState } from "react";

export type DeliveryAddress = {
    addressLine?: string;
    house?: string;
    flat?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
};

type Props = {
    value?: DeliveryAddress;
    onChange?: (addr: DeliveryAddress) => void;
    onSubmit?: (addr: DeliveryAddress) => Promise<void> | void;
    submitLabel?: string;
    className?: string;
};

export const DeliveryForm: React.FC<Props> = ({
                                                  value,
                                                  onChange,
                                                  onSubmit,
                                                  submitLabel = "Перейти к оплате",
                                                  className = "",
                                              }) => {
    const [addr, setAddr] = useState<DeliveryAddress>(() => value ?? {});
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"address" | "payment">("address");

    const update = (patch: Partial<DeliveryAddress>) => {
        const next = { ...addr, ...patch };
        setAddr(next);
        onChange?.(next);
    };

    const handleAddressSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        // No inline validation/errors requested — just proceed
        setLoading(true);
        try {
            await onSubmit?.(addr);
            // move to payment step after successful address submission
            setStep("payment");
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        // Placeholder: integrate with your payment flow
        alert("Здесь должна быть интеграция с платежным шлюзом (mock)");
    };

    return (
        <div className={`w-full max-w-xl mx-auto p-4 ${className}`}>
            {step === "address" ? (
                <form onSubmit={handleAddressSubmit} className="bg-white rounded-xl shadow p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4">Адрес доставки</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Улица, дом, корпус</label>
                            <input
                                type="text"
                                value={addr.addressLine ?? ""}
                                onChange={(e) => update({ addressLine: e.target.value })}
                                placeholder="ул. Ленина, д. 10"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={addr.house ?? ""}
                                onChange={(e) => update({ house: e.target.value })}
                                placeholder="№ дома / кв"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />

                            <input
                                type="text"
                                value={addr.flat ?? ""}
                                onChange={(e) => update({ flat: e.target.value })}
                                placeholder="Квартира / офис"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={addr.floor ?? ""}
                                onChange={(e) => update({ floor: e.target.value })}
                                placeholder="Этаж"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />

                            <input
                                type="text"
                                value={addr.intercom ?? ""}
                                onChange={(e) => update({ intercom: e.target.value })}
                                placeholder="Домофон / код"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Комментарий для курьера</label>
                            <textarea
                                rows={3}
                                value={addr.comment ?? ""}
                                onChange={(e) => update({ comment: e.target.value })}
                                placeholder="Например: оставить у консьержа, позвонить за 5 минут"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 flex-col sm:flex-row">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`big__button w-full sm:w-auto px-5 py-3 rounded-lg text-white font-semibold ${loading ? "opacity-60" : ""}`}
                            >
                                {loading ? "Сохранение..." : submitLabel}
                            </button>

                            <button
                                type="button"
                                onClick={() => setAddr({})}
                                className="w-full sm:w-auto px-5 py-3 rounded-lg border border-gray-200 bg-white text-sm"
                            >
                                Очистить
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-white rounded-xl shadow p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4">Оплата</h3>

                    <div className="text-sm text-gray-700 mb-4">
                        Проверьте данные — далее будет переход к оплате.
                    </div>

                    <div className="flex flex-col gap-3">
                        <button type="button" onClick={handlePay} className="big__button px-5 py-3 rounded-lg text-white font-semibold">
                            Оплатить картой
                        </button>

                        <button type="button" onClick={() => setStep("address")} className="px-5 py-3 rounded-lg border border-gray-200 bg-white text-sm">
                            Назад
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryForm;
