import React, {JSX} from "react"
import Categories from "../components/Widgets/Categories";
import Products from "../components/Widgets/Products";
import {CartWidget} from "../components/Widgets/Cart";

export default function Home(): JSX.Element {
    return (
        <>
            <h1 className="p-3 my-6 text-3xl font-bold">Каталог</h1>

            <Categories/>


            <h1 className="p-3 my-6 text-3xl font-bold">Популярное</h1>

            <Products/>

            <CartWidget/>

        </>
    );
}