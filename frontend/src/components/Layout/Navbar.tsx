import React from 'react';
import { NavLink } from 'react-router-dom';
import profileSvg from "../../assets/profile.svg";
import homeSvg from "../../assets/fire-32.png";
import Search from "../Ui/Search.tsx";

const Navbar: React.FC = () => {
    return (
        <nav className="flex flex-row gap-6 bg-white rounded-b-3xl p-3 mb-3 w-full">
            <NavLink to="/" className="flex gap-1 justify-center items-center">
                <img src={homeSvg}
                     alt="Лого"/>
                <h1>Мигом</h1>
            </NavLink>

            <Search/>

            <NavLink to="/profile" className="p-3 ml-auto my-auto justify-center items-center">
                <img className="w-6 h-6 hover:opacity-80"
                     src={profileSvg}
                     alt="Профиль"/>
            </NavLink>
        </nav>
    );
};

export default Navbar;
