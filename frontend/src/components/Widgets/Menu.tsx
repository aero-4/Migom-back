import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
    onClose?: () => void;
};

export default function Menu({ onClose }: Props): JSX.Element {
    const handleClick = () => {
        onClose?.();
    };

    return (
        <div className="card flex flex-col gap-1 rounded-md bg-white shadow px-9">

            <NavLink
                to="/profile"
                onClick={handleClick}
                className="big__button text-sm bg-blue-400"
            >
                Профиль
            </NavLink>

            <NavLink
                to="/login"
                onClick={handleClick}
                className="big__button text-sm bg-blue-50 text-blue-600"
            >
                Войти
            </NavLink>

            <NavLink
                to="/register"
                onClick={handleClick}
                className="big__button bg-orange-50 text-orange-500"
            >
                Регистрация
            </NavLink>

            <NavLink
                to="/logout"
                onClick={handleClick}
                className="big__button bg-red-50 text-red-500"
            >
                Выйти
            </NavLink>

            <button  className="big__button bg-black text-black-500">
                Темная тема
            </button>
        </div>
    );
}
