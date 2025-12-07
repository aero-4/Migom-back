import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="flex-2 flex flex-col h-full w-full p-10 text-xs gap-3 text-center">
            <a className="block" href="/info/politic_conf">Политика конфиденциальности</a>
            <a className="block" href="/info/">Условия использования</a>
            © 2025 "ООО Мигом" ул. Ленина 4 г. Краснодар
        </footer>
    );
};

export default Footer;
