import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer.tsx";

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="w-full">
                <div className="mx-auto w-full max-w-screen-xl px-3 sm:px-6 lg:px-9">
                    <main className="flex-1 flex overflow-auto justify-center items-center py-6">
                        <div className="w-full">
                            <Outlet/>
                        </div>
                    </main>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Layout;
