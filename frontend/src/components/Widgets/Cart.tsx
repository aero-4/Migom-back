import React, {useEffect, useRef, useState} from "react";
import {useCart} from "../../context/CartContext";
import DeliveryForm from "../Forms/DeliveryForm";
import QuantityInput from "../Ui/QuantityInput.tsx";
import CloseButton from "../Ui/CloseButton.tsx";

export const CartWidget: React.FC = () => {
    const {
        items,
        totalItems,
        totalPrice,
        isOpen,
        close,
        toggle,
        setQty,
        removeItem,
        clear,
        createOrder,
    } = useCart();

    const [loading, setLoading] = useState(false);
    const [isDeliveringForm, setDeliveringForm] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [step, setStep] = useState<"cart" | "address" | "payment">("address");

    useEffect(() => {
        let timer: number | undefined;

        if (isOpen) {
            document.body.style.overflow = "hidden";
            timer = window.setTimeout(() => closeButtonRef.current?.focus(), 120);
        } else {
            document.body.style.overflow = "";
            triggerRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = "";
            if (timer) clearTimeout(timer);
        };
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, close]);


    const handleSwitchToDeliveringForm = () => {
        setDeliveringForm(true);
        setStep("address"); // открываем сразу на шаге адреса
    };

    const handleCheckout = async (addr?: any) => {
        if (items.length === 0) {
            alert("Корзина пуста");
            return;
        }
        setLoading(true);
        const result = await createOrder({source: "web", address: addr});
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
            <button
                type="button"
                ref={triggerRef}
                aria-label="Открыть корзину"
                onClick={toggle}
                className="menu__button"
            >

                {totalItems > 0 && (
                    <span
                        className="absolute justify-center px-1 text-[10px] font-semibold leading-none text-white bg-red-500 rounded-full shadow"
                        aria-live="polite"
                    >
                        {totalItems}
                    </span>
                )}

                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11M4 7H20M4 7V13C4 19.3668 5.12797 20.5 12 20.5C18.872 20.5 20 19.3668 20 13V7M4 7L5.44721 4.10557C5.786 3.428 6.47852 3 7.23607 3H16.7639C17.5215 3 18.214 3.428 18.5528 4.10557L20 7"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <p>Корзина</p>

            </button>

            <div
                aria-hidden={!isOpen}
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{backgroundColor: "rgba(0,0,0,0.5)"}}
                onClick={() => close()}
            />

            <aside
                onClick={(e) => e.stopPropagation()}
                className={`md:p-6 h-full w-full xl:max-w-160 2xl:max-w-220 fixed top-0 right-0 z-50 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } rounded-l-2xl overflow-hidden`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
            >
                {!isDeliveringForm || step === "cart" ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="w-full flex flex-col min-h-0">
                            <div className="flex items-center justify-between p-3">
                                <h3 id="cart-title" className="text-2xl font-semibold text-gray-800">
                                    Корзина
                                </h3>

                                <div className="flex items-center gap-3">

                                    <CloseButton close={close}/>
                                </div>
                            </div>

                            <div className="overflow-y-auto">
                                {items.length === 0 ? (
                                    <div className="flex flex-col my-auto text-center items-center justify-center text-gray-600">
                                        <div className="text-3xl font-medium">Корзина пуста</div>
                                        <div className="text-sm mt-2">Добавьте товары и они появятся тут.</div>
                                    </div>
                                ) : (
                                    <ul className="space-y-5 w-full p-2">
                                        {items.map((item) => (
                                            <li key={item.id}
                                                className="flex gap-3 items-start p-1 md:p-6 rounded-lg border border-gray-100">
                                                <div
                                                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img src={item.image}
                                                             alt={item.name}
                                                             className="w-full h-full object-cover cursor-pointer"
                                                             onClick={()=> document.location.href = "/product/" + item.id}
                                                        />
                                                    ) : (
                                                        <div className="text-xs text-gray-400">
                                                            PHOTO
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="font-medium text-gray-800 truncate">
                                                            {item.name}
                                                        </div>

                                                    </div>

                                                    <div className="mt-4 flex items-center gap-3">

                                                        <QuantityInput item={item} setQty={setQty} max={item.qty}/>

                                                        <div className="ml-auto text-lg text-gray-600"><span
                                                            className="font-semibold text-gray-800">{(item.price * item.qty).toLocaleString()} ₽</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto flex flex-col">
                            <div className="p-3 flex flex-col">

                                <div className="mb-6 flex flex-row items-center justify-center w-full">
                                    <div className="text-gray-600 p-3">К оплате:</div>

                                    <div className="justify-center font-bold text-2xl md:text-3xl text-gray-900">
                                        {totalPrice.toLocaleString()} ₽
                                    </div>

                                </div>


                                <div className="flex flex-row gap-1">
                                    <button
                                        type="button"
                                        onClick={clear}
                                        disabled={items.length === 0}
                                        className="w-full btn__circle text-gray-700 bg-gray-200 hover:bg-gray-100"
                                    >
                                        Очистить корзину
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSwitchToDeliveringForm}
                                        disabled={loading || items.length === 0}
                                        className={`w-full flex items-center justify-center text-white btn__circle ${
                                            loading || items.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                                        } focus:outline-none focus:ring-4 focus:ring-red-300`}
                                    >
                                        Оформить заказ
                                    </button>


                                </div>
                            </div>

                        </div>
                    </div>
                ) : <DeliveryForm onSubmit={handleCheckout}
                                  step={step}
                                  setStep={setStep}
                                  onClose={close}/>}
            </aside>
        </>
    );
};

export default CartWidget;
