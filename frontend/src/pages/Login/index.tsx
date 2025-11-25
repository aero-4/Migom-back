import React, {JSX} from "react"
import {useNavigate} from "react-router-dom";

export default function Login(): JSX.Element {
    const navigate = useNavigate();

    return (
        <>
            <div className="card form__actions max-w-xl justify-center mx-auto h-full my-auto">

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="form__label">Email</label>
                    <input type="text"
                          className="input"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Пароль</label>
                    <input type="text"
                          className="input"/></div>

                <div className="flex flex-col gap-3">
                    <button className="big__button btn__circle">
                        Войти
                    </button>
                    <button className="btn__circle big__button  bg-blue-600"
                            onClick={() => navigate("/register")}>
                        Зарегистрироваться
                    </button>
                </div>

            </div>
        </>
    );
}
