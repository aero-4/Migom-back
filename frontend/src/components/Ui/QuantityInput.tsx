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

const QuantityInput: React.FC<Props> = ({item, setQty, min = 0, max = Infinity, iconSrc}) => {
    const dec = () => setQty(item.id, Math.max(min, item.qty - 1));
    const inc = () => setQty(item.id,  item.qty + 1);

    const isDecDisabled = item.qty <= min;
    const isIncDisabled = item.qty >= max;

    return (
        <div className="inline-flex items-center rounded-lg overflow-hidden bg-white">
            <button
                type="button"
                onClick={dec}
                disabled={isDecDisabled}
                aria-label="Уменьшить"
                aria-disabled={isDecDisabled}
                className={`
                  flex items-center justify-center
                  text-sm sm:text-base md:text-lg
                  px-2 sm:px-3 md:px-4
                  py-2
                  min-w-[44px] min-h-[44px]   /* гарантируем touch target >= 44px */
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-50 focus:outline-none
                  cursor-pointer`}
            >
                −
            </button>

            <div
                className={`
                  px-3 sm:px-3
                  py-2
                  min-w-[44px] min-h-[44px]
                  flex items-center justify-center
                  font-medium
                  text-sm sm:text-base md:text-lg
                `}
            >
                {item.qty}
            </div>

            <button
                type="button"
                onClick={inc}
                disabled={isIncDisabled}
                aria-label="Увеличить"
                aria-disabled={isIncDisabled}
                className={`
                  flex items-center justify-center
                  text-sm sm:text-base md:text-lg
                  px-2 sm:px-3 md:px-4
                  py-2
                  min-w-[44px] min-h-[44px]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-50 focus:outline-none
                `}
            >
                +
            </button>

            {iconSrc && (
                <img
                    src={iconSrc}
                    alt="qty"
                    className="ml-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-sm object-cover"
                />
            )}
        </div>
    );
};

export default QuantityInput;
