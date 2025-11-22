import React, {JSX} from "react"
import Categories from "../../components/Widgets/Categories.tsx";
import Products from "../../components/Widgets/Products.tsx";
import {CartWidget} from "../../components/Widgets/Cart.tsx";
import {CartProvider} from "../../context/CartContext";

export default function Home(): JSX.Element {
    return (
        <>
            <div>
                <Categories/>

                <CartProvider>

                    <h1 className="p-3 my-6 text-3xl font-bold">Популярное</h1>

                    <Products/>

                    <CartWidget/>
                </CartProvider>
            </div>
        </>
    );
}