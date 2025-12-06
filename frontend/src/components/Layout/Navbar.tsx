import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import profileSvg from "../../assets/profile.svg";
import homeSvg from "../../assets/fire-32.png";
import profileMobileSvg from "../../assets/profile.svg"; // другой svg для мобильного
import searchMobileSvg from "../../assets/search.svg";   // другой svg для мобильного
import homeMobileSvg from "../../assets/fire-32.png";       // другой svg для мобильного
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
            {/* --- Desktop / tablet navbar (md and up) --- */}
            <nav className="hidden md:flex flex-row gap-6 bg-white rounded-b-3xl p-3 mb-3 w-full relative">
                <NavLink to="/" className="flex gap-1 justify-center items-center">
                    <img src={homeSvg} alt="Лого"/>
                    <h1>Мигом</h1>
                </NavLink>

                <Search/>

                <div
                    ref={containerRef}
                    className="ml-auto relative"
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
                        <div className="absolute right-0 mt-2 z-50">
                            <Menu onClose={() => setMenuOpen(false)} />
                        </div>
                    )}
                </div>
            </nav>

            <div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-full md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                role="navigation"
                aria-label="Нижнее меню"
            >
                <div className="max-w-4xl mx-auto flex justify-around items-center p-2">
                    <button
                        aria-label="Домой"
                        className="flex flex-col items-center text-xs focus:outline-none"
                        onClick={() => navigate('/')}
                    >
                        <img src={homeMobileSvg} alt="Домой" className="w-6 h-6" />
                        <span className="mt-1">Домой</span>
                    </button>

                    <button
                        aria-label="Поиск"
                        className="flex flex-col items-center text-xs focus:outline-none"
                        onClick={() => setMobileSearchOpen(true)}
                    >
                        <img src={searchMobileSvg} alt="Поиск" className="w-6 h-6" />
                        <span className="mt-1">Поиск</span>
                    </button>

                    <button
                        aria-label="Профиль"
                        className="flex flex-col items-center text-xs focus:outline-none"
                        onClick={() => navigate('/profile')}
                    >
                        <img src={profileMobileSvg} alt="Профиль" className="w-6 h-6" />
                        <span className="mt-1">Профиль</span>
                    </button>

                    <CartWidget/>
                </div>
            </div>

            {/* --- Mobile search overlay/modal --- */}
            {isMobileSearchOpen && (
                <div
                    className="fixed inset-0 z-60 bg-black/50 flex items-start justify-center p-4 md:hidden"
                    onClick={() => setMobileSearchOpen(false)}
                >
                    <div
                        className="w-full max-w-3xl bg-white rounded-xl p-4 mt-12"
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
