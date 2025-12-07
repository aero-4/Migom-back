import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import profileSvg from "../../assets/profile.svg";
import homeSvg from "../../assets/fire-32.png";
import profileMobileSvg from "../../assets/profile.svg";
import searchMobileSvg from "../../assets/search.svg";
import homeMobileSvg from "../../assets/fire-32.png";
import Search from "../Ui/Search.tsx";
import Menu from "../Widgets/Menu.tsx";
import CartWidget from "../Widgets/Cart.tsx";

const Navbar: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handlePointerDown(e: MouseEvent | TouchEvent) {
            const el = containerRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                setMenuOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setMobileSearchOpen(false);
            }
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
        <>
            <nav className="hidden md:flex flex-row gap-6 bg-white rounded-b-3xl p-3 mb-3 w-full relative items-center">
                <NavLink to="/" className="flex gap-1 justify-center items-center">
                    <img src={homeSvg} alt="Лого"/>
                    <h1>Мигом</h1>
                </NavLink>

                <Search/>

                <div
                    ref={containerRef}
                    className="ml-auto relative flex items-center gap-2"
                    onMouseEnter={() => setMenuOpen(true)}
                    onFocus={() => setMenuOpen(true)}
                >
                    <button
                        className="p-3 my-auto justify-center items-center"
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <img
                            className="w-6 h-6 hover:opacity-80"
                            src={profileSvg}
                            alt="Профиль"
                        />
                    </button>

                    {isMenuOpen && (
                        <Menu onClose={() => setMenuOpen(false)} />
                    )}
                </div>
            </nav>

            <div
                className="fixed z-100 bottom-0 left-0 right-0 bg-gray-50 rounded-t-3xl"
                style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
                role="navigation"
                aria-label="Нижнее меню"
            >
                <div className="max-w-4xl mx-auto flex justify-around items-center p-6">
                    <button
                        aria-label="Домой"
                        className="menu__button"
                        onClick={() => navigate('/')}
                    >
                        <img src={homeMobileSvg} alt="Домой" className="w-6 h-6"/>
                        <span className="mt-1">Домой</span>
                    </button>

                    <button
                        aria-label="Поиск"
                        className="menu__button"
                        onClick={() => setMobileSearchOpen(true)}
                    >
                        <img src={searchMobileSvg} alt="Поиск" className="w-6 h-6"/>
                        <span className="mt-1">Поиск</span>
                    </button>

                    <CartWidget/>


                    <button
                        aria-label="Профиль"
                        className="menu__button"
                        onClick={() => navigate('/profile')}
                    >
                        <img src={profileMobileSvg} alt="Профиль" className="w-6 h-6" />
                        <span className="mt-1">Профиль</span>
                    </button>

                </div>
            </div>

            {isMobileSearchOpen && (
                <div
                    className="fixed inset-0 z-60 bg-black/50 flex items-start justify-center p-7"
                    onClick={() => setMobileSearchOpen(false)}
                >
                    <div
                        className="shadow w-full max-w-3xl bg-white rounded-xl p-6 mt-12"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end">
                            <button
                                aria-label="Закрыть поиск"
                                className="p-2"
                                onClick={() => setMobileSearchOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <Search />
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
