import React, { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import profileSvg from "../../assets/profile.svg";
import homeSvg from "../../assets/fire-32.png";
import Search from "../Ui/Search.tsx";
import Menu from "../Widgets/Menu.tsx";

const Navbar: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handlePointerDown(e: MouseEvent | TouchEvent) {
            const el = containerRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                setMenuOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setMenuOpen(false);
        }

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <nav className="flex flex-row gap-6 bg-white rounded-b-3xl p-3 mb-3 w-full relative">
            <NavLink to="/" className="flex gap-1 justify-center items-center">
                <img src={homeSvg} alt="Лого"/>
                <h1>Мигом</h1>
            </NavLink>

            <Search/>

            <div
                ref={containerRef}
                className="ml-auto relative"
                onMouseEnter={() => setMenuOpen(true)}
            >
                <button
                    className="p-3 my-auto justify-center items-center"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                >
                    <img
                        className="w-6 h-6 hover:opacity-80"
                        src={profileSvg}
                        alt="Профиль"
                    />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 z-50">
                        <Menu onClose={() => setMenuOpen(false)} />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
