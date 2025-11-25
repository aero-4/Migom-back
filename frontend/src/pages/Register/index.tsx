import React from 'react';

function Register() {
    return (
        <div className="form card flex flex-col gap-16 max-w-xl justify-center mx-auto h-full my-auto">

            <div className="flex flex-row gap-2">
                <div>
                    <label htmlFor="firstName" className="form__label">Имя</label>
                    <input type="text"
                           className="input"/>
                </div>

                <div>
                    <label htmlFor="lastName">Фамилия</label>
                    <input type="text"
                           className="input"/>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="password">Email</label>
                <input type="text"
                       className="input"/>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="password">Пароль</label>
                <input type="text"
                       className="input"/>

                <label htmlFor="password">Подтвердите пароль</label>
                <input type="text"
                       className="input"/>
            </div>

            <div className="flex flex-col gap-3">
                <button className="btn__circle big__button  bg-blue-600">
                    Зарегистрироваться
                </button>
            </div>

        </div>
    );
}

export default Register;