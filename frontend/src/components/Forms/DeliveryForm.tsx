// DeliveryFormLarge.tsx
import React, { useState } from "react";

export type DeliveryAddress = {
    addressLine?: string;
    country?: string;
    region?: string;
    city?: string;
    street?: string;
    house?: string;
    building?: string;
    flat?: string;
    floor?: string;
    entrance?: string;
    intercom?: string;
    recipient?: string;
    phone?: string;
    comment?: string;
    lat?: number;
    lon?: number;
};

type Props = {
    value?: DeliveryAddress;
    onChange?: (addr: DeliveryAddress) => void;
    onSubmit?: (addr: DeliveryAddress) => Promise<void> | void;
    submitLabel?: string;
    className?: string;
};

const focusRing = "focus:outline-none focus:ring-4 focus:ring-emerald-200";

export const DeliveryFormLarge: React.FC<Props> = ({
                                                       value,
                                                       onChange,
                                                       onSubmit,
                                                       submitLabel = "Оформить доставку",
                                                       className = "",
                                                   }) => {
    const [addr, setAddr] = useState<DeliveryAddress>(() => value ?? {});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [geoStatus, setGeoStatus] = useState<string | null>(null);

    const update = (patch: Partial<DeliveryAddress>) => {
        const next = { ...addr, ...patch };
        setAddr(next);
        onChange?.(next);
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!addr.recipient || addr.recipient.trim().length < 2) e.recipient = "Введите имя получателя";
        if (!addr.phone || !/^\+?\d{7,15}$/.test(addr.phone.replace(/[()\s-]/g, "")))
            e.phone = "Введите корректный телефон (цифры, можно +)";
        if (!addr.addressLine && !(addr.city && addr.street && addr.house)) e.addressLine = "Укажите адрес доставки";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            await onSubmit?.(addr);
        } finally {
            setLoading(false);
        }
    };

    const useGeolocation = () => {
        if (!("geolocation" in navigator)) {
            setGeoStatus("Геолокация не доступна в этом браузере");
            return;
        }
        setGeoStatus("Определение местоположения...");
        navigator.geolocation.getCurrentPosition(
            (p) => {
                update({ lat: p.coords.latitude, lon: p.coords.longitude });
                setGeoStatus("Координаты определены — сохраните заказ.");
            },
            (err) => {
                setGeoStatus("Ошибка определения местоположения: " + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`mx-auto w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10 text-gray-800 ${className}`}
            aria-labelledby="delivery-form-title"
        >
            <div className="mb-6">
                <h2 id="delivery-form-title" className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    Адрес доставки
                </h2>
                <p className="mt-2 text-sm text-gray-600">Укажите удобный адрес и дополнительные данные для курьера</p>
            </div>

            {/* main grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                    {/* Full address line (search / typed) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Адрес (полная строка)</label>
                        <input
                            type="text"
                            value={addr.addressLine ?? ""}
                            onChange={(e) => update({ addressLine: e.target.value })}
                            placeholder="Например: г. Москва, ул. Ленина, д. 10, кв. 5"
                            className={`w-full rounded-lg border px-4 py-3 text-base ${focusRing} ${
                                errors.addressLine ? "border-red-400" : "border-gray-200"
                            }`}
                            aria-invalid={!!errors.addressLine}
                            aria-describedby={errors.addressLine ? "err-addressLine" : undefined}
                        />
                        {errors.addressLine && (
                            <p id="err-addressLine" className="mt-1 text-sm text-red-600">
                                {errors.addressLine}
                            </p>
                        )}
                    </div>

                    {/* City / Street / House */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Город</label>
                            <input
                                type="text"
                                value={addr.city ?? ""}
                                onChange={(e) => update({ city: e.target.value })}
                                placeholder="Город"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Улица</label>
                            <input
                                type="text"
                                value={addr.street ?? ""}
                                onChange={(e) => update({ street: e.target.value })}
                                placeholder="Название улицы"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Дом</label>
                            <input
                                type="text"
                                value={addr.house ?? ""}
                                onChange={(e) => update({ house: e.target.value })}
                                placeholder="№ дома"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Корпус / строение</label>
                            <input
                                type="text"
                                value={addr.building ?? ""}
                                onChange={(e) => update({ building: e.target.value })}
                                placeholder="Корпус"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Квартира / офис</label>
                            <input
                                type="text"
                                value={addr.flat ?? ""}
                                onChange={(e) => update({ flat: e.target.value })}
                                placeholder="Кв."
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Этаж</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={addr.floor ?? ""}
                                onChange={(e) => update({ floor: e.target.value })}
                                placeholder="Этаж"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Подъезд</label>
                            <input
                                type="text"
                                value={addr.entrance ?? ""}
                                onChange={(e) => update({ entrance: e.target.value })}
                                placeholder="Подъезд"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Домофон / код</label>
                            <input
                                type="text"
                                value={addr.intercom ?? ""}
                                onChange={(e) => update({ intercom: e.target.value })}
                                placeholder="Код домофона"
                                className="w-full rounded-lg border px-3 py-2 text-base border-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Контакт получателя</label>
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                value={addr.recipient ?? ""}
                                onChange={(e) => update({ recipient: e.target.value })}
                                placeholder="Фамилия Имя Отчество"
                                className={`w-full rounded-lg border px-4 py-3 text-base ${focusRing} ${
                                    errors.recipient ? "border-red-400" : "border-gray-200"
                                }`}
                                aria-invalid={!!errors.recipient}
                                aria-describedby={errors.recipient ? "err-recipient" : undefined}
                            />
                            {errors.recipient && (
                                <p id="err-recipient" className="mt-1 text-sm text-red-600">
                                    {errors.recipient}
                                </p>
                            )}

                            <input
                                type="tel"
                                inputMode="tel"
                                value={addr.phone ?? ""}
                                onChange={(e) => update({ phone: e.target.value })}
                                placeholder="+7 912 345 67 89"
                                className={`w-full rounded-lg border px-4 py-3 text-base ${focusRing} ${
                                    errors.phone ? "border-red-400" : "border-gray-200"
                                }`}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? "err-phone" : undefined}
                            />
                            {errors.phone && (
                                <p id="err-phone" className="mt-1 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Комментарий для курьера</label>
                        <textarea
                            rows={5}
                            value={addr.comment ?? ""}
                            onChange={(e) => update({ comment: e.target.value })}
                            placeholder="Особенности: оставить у консьержа, позвонить за 5 минут и т.п."
                            className="w-full rounded-lg border px-4 py-3 text-base border-gray-200 resize-none"
                        />
                        <div className="mt-2 text-xs text-gray-500">Максимум 300 символов</div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-emerald-800">Координаты для курьера</div>
                                <div className="text-xs text-emerald-700 mt-1">
                                    {addr.lat && addr.lon
                                        ? `Широта: ${addr.lat.toFixed(5)}, Долгота: ${addr.lon.toFixed(5)}`
                                        : "Координаты не заданы"}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={useGeolocation}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                                >
                                    Определить моё местоположение
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        update({ lat: undefined, lon: undefined });
                                        setGeoStatus(null);
                                    }}
                                    className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 bg-white text-sm"
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                        {geoStatus && <div className="mt-2 text-sm text-gray-600">{geoStatus}</div>}
                    </div>
                </div>
            </div>

            {/* footer actions */}
            <div className="mt-6 border-t pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex-1">
                    <div className="text-sm text-gray-600">
                        Проверьте адрес и контакт — курьер позвонит перед доставкой.
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            // quick fill demo data (for testing)
                            update({
                                city: addr.city ?? "Москва",
                                street: addr.street ?? "ул. Ленина",
                                house: addr.house ?? "10",
                            });
                        }}
                        className="hidden md:inline-flex items-center px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                        Заполнить пример
                    </button>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold ${
                            loading ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                        } ${focusRing}`}
                    >
                        {loading ? "Сохранение..." : submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default DeliveryFormLarge;
