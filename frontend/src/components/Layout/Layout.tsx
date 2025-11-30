import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer.tsx";
import {CartProvider} from "../../context/CartContext.tsx";
const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">

            <div className="w-full">
                <div className="mx-auto w-full max-w-screen-lg">
                    <main className="flex-1 flex overflow-auto justify-center items-center">
                        <div className="w-full">
                            <Navbar />
                            <CartProvider>
                                <Outlet/>
                            </CartProvider>
                            <Footer/>
                        </div>
                    </main>
                </div>
            </div>

        </div>
    );
};

export default Layout;
