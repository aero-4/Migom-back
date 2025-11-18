import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import DeliveryFormLarge from "../Forms/DeliveryForm.tsx";

/**
 * Adaptive, large, accessible CartWidget (Sber-like style)
 * - Uses Tailwind classes (you already have Tailwind in project)
 * - Focus management, Escape to close, body scroll lock
 */
export const CartWidget: React.FC = () => {
    const {
        items,
        totalItems,
        totalPrice,
        isOpen,
        open,
        close,
        toggle,
        setQty,
        removeItem,
        clear,
        createOrder,
    } = useCart();

    const [loading, setLoading] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    // focus management: when opening focus close button; when closing restore focus to trigger
    useEffect(() => {
        if (isOpen) {
            // lock body scroll
            document.body.style.overflow = "hidden";
            setTimeout(() => closeButtonRef.current?.focus(), 120);
        } else {
            document.body.style.overflow = "";
            triggerRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, close]);

    const handleCheckout = async () => {
        if (items.length === 0) {
            alert("Корзина пуста");
            return;
        }
        setLoading(true);
        const result = await createOrder({ source: "web" });
        setLoading(false);

        if (result.ok) {
            clear();
            close();
            alert("Заказ отправлен успешно! Номер: " + (result.data?.orderId ?? "—"));
        } else {
            alert("Ошибка при оформлении заказа: " + (result.error ?? "unknown"));
        }
    };

    return (
        <>
            {/* Floating button - larger & Sber-like green */}
            <button
                ref={triggerRef}
                aria-label="Открыть корзину"
                onClick={toggle}
                className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-16 h-16 rounded-full shadow-2xl bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            >
                {/* shopping cart icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11M4 7H20M4 7V13C4 19.3668 5.12797 20.5 12 20.5C18.872 20.5 20 19.3668 20 13V7M4 7L5.44721 4.10557C5.786 3.428 6.47852 3 7.23607 3H16.7639C17.5215 3 18.214 3.428 18.5528 4.10557L20 7"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {totalItems > 0 && (
                    <span
                        className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-600 rounded-full shadow"
                        aria-live="polite"
                    >
            {totalItems}
          </span>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={close}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
                    aria-hidden
                />
            )}

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
            >
                {/* Container responsive: full width on small, two-column on md+ */}
                <div className="flex h-full flex-col md:flex-row md:max-w-4xl md:ml-auto">
                    {/* left: list (on md takes 2/3) */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h3 id="cart-title" className="text-2xl font-semibold text-gray-800">
                                    Корзина
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Товары, которые вы выбрали</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={clear}
                                    className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md border border-gray-100 bg-gray-50"
                                >
                                    Очистить
                                </button>
                                <button
                                    ref={closeButtonRef}
                                    onClick={close}
                                    aria-label="Закрыть корзину"
                                    className="p-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-auto">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                        <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                                    </svg>
                                    <div className="text-lg font-medium">Корзина пуста</div>
                                    <div className="text-sm mt-2">Добавьте товары — они появятся тут</div>
                                </div>
                            ) : (
                                <ul className="space-y-5">
                                    {items.map((it) => (
                                        <li key={it.id} className="flex gap-4 items-start p-4 rounded-lg border border-gray-100">
                                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                {it.image ? (
                                                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-xs text-gray-400">no photo</div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="text-lg font-medium text-gray-800 truncate">{it.name}</div>
                                                        <div className="text-sm text-gray-500 mt-1">{it.price.toLocaleString()} ₽</div>
                                                    </div>

                                                    <div className="text-right">
                                                        <button
                                                            onClick={() => removeItem(it.id)}
                                                            className="text-sm text-red-600 hover:underline"
                                                            aria-label={`Удалить ${it.name}`}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center gap-3">
                                                    <div className="flex items-center rounded-lg border border-gray-200">
                                                        <button
                                                            onClick={() => setQty(it.id, Math.max(0, it.qty - 1))}
                                                            className="px-4 py-2 text-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                                                            aria-label={`Уменьшить количество ${it.name}`}
                                                        >
                                                            −
                                                        </button>
                                                        <div className="px-5 py-2 text-lg font-medium min-w-[48px] text-center">{it.qty}</div>
                                                        <button
                                                            onClick={() => setQty(it.id, it.qty + 1)}
                                                            className="px-4 py-2 text-lg font-medium hover:bg-gray-50"
                                                            aria-label={`Увеличить количество ${it.name}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="ml-auto text-sm text-gray-600">Сумма: <span className="font-semibold text-gray-800">{(it.price * it.qty).toLocaleString()} ₽</span></div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>



                    {/* right: summary (on md takes 1/3) */}
                    <div className="w-full md:w-1/3 border-l border-gray-100 bg-gray-50 flex flex-col">
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-6">
                                <div className="text-sm text-gray-600">Итого</div>
                                <div className="mt-2 text-2xl font-extrabold text-gray-900">{totalPrice.toLocaleString()} ₽</div>
                                <div className="text-sm text-gray-500 mt-1">({totalItems} {totalItems === 1 ? "товар" : "товара"})</div>
                            </div>

                            {/* extra info / form fields can be added here */}
                            <div className="mt-auto">
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || items.length === 0}
                                    className={`w-full flex items-center justify-center gap-3 py-3 rounded-md text-white ${
                                        loading || items.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                    } focus:outline-none focus:ring-4 focus:ring-emerald-300`}
                                >
                                    {loading ? "Отправка..." : "Оформить заказ"}
                                </button>

                                <button
                                    onClick={clear}
                                    disabled={items.length === 0}
                                    className="w-full mt-3 py-3 rounded-md border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Очистить корзину
                                </button>

                                <button
                                    onClick={close}
                                    className="w-full mt-3 py-3 rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Продолжить покупки
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t text-xs text-gray-500">
                            Безопасная оплата. Доставка и возврат — по условиям магазина.
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default CartWidget;
