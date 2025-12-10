import {JSX} from "react"

export default function NotFound(): JSX.Element {
    return (
        <>
            <div className="container w-full h-full">
                <div className="flex flex-col gap-9 overflow-auto my-auto justify-center items-center text-center">
                    <h1 className="text-3xl helper-text animate-pulse">Увы... Похоже что такой страницы больше нет.</h1>

                    <a href="/"
                       className="big__button full__button">

                        <span className="text-white">
                            Перейти на Главную
                        </span>
                    </a>
                </div>

            </div>
        </>
    );
}