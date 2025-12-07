import React, {JSX, useEffect, useState} from "react";
import config from "../../../config.ts";


export default function Categories(): JSX.Element {
    const [cats, setCats] = useState([])

    useEffect(() => {
        const controller = new AbortController();
        let mounted = true;

        const load = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/categories`, { signal: controller.signal });
                if (!res.ok)
                    throw new Error("No categories");
                const data = await res.json();

                setCats(data)
            } catch (err: any) {
                if (!mounted) return;
                if (err.name === "AbortError") {
                    return;
                }
                console.error("Failed loading categories:", err);
                setCats([]);
            }
        };

        load();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-between items-center p-6 rounded-xl">
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