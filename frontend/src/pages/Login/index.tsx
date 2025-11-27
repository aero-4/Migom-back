import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setError(null);

        if (!form.email.trim() || !form.password) {
            setError("Укажите email и пароль");
            return;
        }

        setLoading(true);
        const res = await login({ email: form.email.trim(), password: form.password });
        setLoading(false);

        if (!res.ok) {
            setError(res.message || "Неверные данные");
            return;
        }

        // Успешный вход — редирект на главную
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-2xl p-4 gap-4 flex flex-col">
                <h2 className="text-lg font-semibold text-center">Вход</h2>

                <label className="flex flex-col text-sm">
                    <span className="mb-1">Email</span>
                    <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        className="p-2 text-sm rounded-md border border-gray-200"
                        autoComplete="email"
                    />
                </label>

                <label className="flex flex-col text-sm">
                    <span className="mb-1">Пароль</span>
                    <input
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        type="password"
                        className="p-2 text-sm rounded-md border border-gray-200"
                        autoComplete="current-password"
                    />
                </label>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex flex-col gap-3">
                    <button type="submit" className="w-full py-2 text-sm rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60" disabled={loading}>
                        {loading ? "Вход..." : "Войти"}
                    </button>
                </div>

                <div className="text-center mt-2 text-sm">
                    <button type="button" className="underline" onClick={() => navigate("/register")}>Зарегистрироваться</button>
                </div>
            </form>
        </div>
    );
}

export default Login;