import React from "react";


export type CartItemMin = {
    id: string | number;
    qty: number;
};


type Props = {
    item: CartItemMin;
    setQty: (id: string | number, qty: number) => void;
    min?: number;
    max?: number;
    iconSrc?: string;
};


const QuantityInput: React.FC<Props> = ({ item, setQty, min = 0, max = Infinity, iconSrc }) => {
    const dec = () => setQty(item.id, Math.max(min, item.qty - 1));
    const inc = () => setQty(item.id, Math.min(max, item.qty + 1));


    return (
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
            <button
                type="button"
                onClick={dec}
                aria-label="Уменьшить"
                className="px-5 py-1 text-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
                −
            </button>


            <div className="px-4 py-2 min-w-[48px] text-center font-medium">{item.qty}</div>


            <button
                type="button"
                onClick={inc}
                aria-label="Увеличить"
                className="px-5 py-1 text-lg font-medium hover:bg-gray-50"
            >
                +
            </button>


            {iconSrc && (
                <img src={iconSrc} alt="qty" className="w-8 h-8 ml-2 rounded-sm object-cover" />
            )}
        </div>
    );
};

export default QuantityInput;