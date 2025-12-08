import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="my-20 flex-2 flex flex-col h-full w-full p-10 text-xs gap-3 text-center">
            <a className="block" href="/info/politic_conf">Политика конфиденциальности</a>
            <a className="block" href="/info/">Условия использования</a>
            <span>© 2025 "ООО Мигом" ул. Ленина 4 г. Краснодар</span>
        </footer>
    );
};

export default Footer;
