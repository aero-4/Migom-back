import React from 'react';
import { NavLink } from 'react-router-dom';
import profileSvg from "../../assets/user-32.png";
import homeSvg from "../../assets/fire-32.png";
import Search from "../Ui/Search.tsx";

const Navbar: React.FC = () => {
    return (
        <nav className="flex flex-row gap-6 bg-white rounded-b-3xl p-3 mb-1 mb-6">
            <NavLink to="/" className="flex gap-1 justify-center items-center">
                <img src={homeSvg} alt="Лого"/>
                Мигом
            </NavLink>

            <Search/>

            <NavLink to="/profile" className="my-auto mx-auto">
                <img src={profileSvg} alt="Профиль"/>
            </NavLink>
        </nav>
    );
};

export default Navbar;
