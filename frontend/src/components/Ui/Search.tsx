import React from 'react';
import searchSvg from "../../assets/search.svg";

const Search: React.FC = () => {
    return (
        <div className="justify-center text-center flex flex-1 border-gray-200 border-1 border rounded-full max-w-xl shadow">
            <input type="text"
                   placeholder="Поиск..."
                   className="search__input"
            />
            <button type="button"
                    className="full__button">
                <img src={searchSvg}
                     alt="Поиск"
                     className="w-8"/>
            </button>
        </div>
    );
};

export default Search;
