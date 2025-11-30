import React, {JSX, useEffect, useState} from "react";
import teaPng from "../../assets/tea.png";
import fruitsPng from "../../assets/fruits_orange.png";
import meatPng from "../../assets/meat.png";


type Category = {
    id?: string;
    name?: string;
    slug?: string;
    photo?: string;
};

export default function Categories(): JSX.Element {
    const [cats, setCats] = useState([])

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await fetch("/api/products");
                if (!res.ok)
                    throw new Error("no products");

                const resp_data = await res.json();

                if (!cancelled) {
                    setCats(resp_data);
                }
            } catch {
                if (!cancelled) {
                    setCats(resp_data);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [cats]);

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-between items-center bg-white p-6 rounded-xl">
                {cats.map((category, idx) => (
                    <a href={`/category/${category.id}`}
                       className="flex flex-col"
                       key={`cat-${idx}`}
                    >
                        <img
                            src={category.photo}
                            alt="Фото категории"
                            className="cat__img"
                        />
                        <span
                            className="cat__name">
                            {category.name}
                        </span>
                    </a>
                ))}

            </div>
        </>
    );
}