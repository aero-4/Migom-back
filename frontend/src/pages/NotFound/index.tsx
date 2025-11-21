import {JSX} from "react"

export default function NotFound(): JSX.Element {
    return (
        <>
            <div className="flex flex-col gap-4 p-4
            lg:flex-row">
                <div className="justify-center items-center my-auto">
                </div>

                <div className="flex flex-col gap-9">
                    <h1 className="text-2xl">Увы... Похоже что такой страницы больше нет.</h1>
                    <a href="/"
                       className="big__button">

                        <span className="text-white">
                            {'>'} Перейти на Главную
                        </span>
                    </a>
                </div>

            </div>
        </>
    );
}