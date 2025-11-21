import React, {JSX, useState} from "react";
import plusPng from "../../assets/plus.png";
import minusPng from "../../assets/minus-sign.png";
import {useCart} from "../../context/CartContext.tsx";


export default function AddInCartBtn({product}): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const {addItem} = useCart();
    const {removeItem} = useCart()
    const setCountHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name;
        const delta = name === "plus" ? 1 : name === "minus" ? -1 : 0;
        const newCount = count + delta;

        if (newCount < 0 || newCount > product.count)
            return;


        setCount(newCount);
        if (delta == 1) {
            addItem({...product, id: product.id, image: product.photo});
        } else {
            removeItem(product.id)
        }
    };

    return (
        <div className="flex flex-row flex-wrap ml-auto bg-red-100 rounded-2xl">
            {count <= 0 ? (
                <div>
                    <button
                        type="button"
                        name="plus"
                        className="add__button"
                        onClick={setCountHandler}
                        aria-label="Добавить"
                    >
                        <img src={plusPng} className="w-3 lg:w-4" alt="Добавить"/>
                    </button>
                </div>
            ) : (
                <div className="flex flex-row gap-2 items-center">
                    <button
                        name="minus"
                        className="add__button"
                        onClick={setCountHandler}
                        aria-label="Уменьшить"
                    >
                        <img src={minusPng} className="w-3 lg:w-4" alt="Уменьшить"/>
                    </button>

                    <span className="text-center text-xs">{count}</span>

                    <button
                        name="plus"
                        className="add__button"
                        onClick={setCountHandler}
                        aria-label="Добавить ещё"
                    >
                        <img src={plusPng} className="w-3 lg:w-4" alt="Добавить"/>
                    </button>
                </div>
            )}
        </div>
    );
}
