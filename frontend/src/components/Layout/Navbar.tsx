import React from 'react';
import { NavLink } from 'react-router-dom';
import profileSvg from "../../assets/user-32.png";
import homeSvg from "../../assets/fire-32.png";
import Search from "../Ui/Search.tsx";

const Navbar: React.FC = () => {
    return (
        <nav className="flex flex-row gap-9 bg-white rounded-b-3xl p-3 mb-1">
            <NavLink to="/" className="flex gap-2 justify-center items-center">
                <img src={homeSvg} alt=""/>
                Мигом
            </NavLink>

            <Search/>

            <NavLink to="/profile" className="my-auto mx-auto">
                <img src={profileSvg} alt=""/>
            </NavLink>
        </nav>
    );
};

export default Navbar;
