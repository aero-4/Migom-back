import React, { useState } from "react";

// Компактная страница регистрации с валидацией и POST-запросом на /api/register
export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        birthdate: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [serverError, setServerError] = useState(null);

    // Небольшие утилиты валидации
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isStrongPassword = (pw) => {
        // Минимум 8 символов, хотя бы одна цифра и одна буква
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw);
    };

    const validate = (values) => {
        const e = {};
        if (!values.firstName.trim()) e.firstName = "Укажите имя";
        if (!values.lastName.trim()) e.lastName = "Укажите фамилию";
        if (!values.email.trim()) e.email = "Укажите email";
        else if (!isValidEmail(values.email.trim())) e.email = "Некорректный email";

        if (!values.password) e.password = "Укажите пароль";
        else if (!isStrongPassword(values.password))
            e.password = "Пароль должен быть минимум 8 символов и содержать буквы и цифры";

        if (!values.confirmPassword) e.confirmPassword = "Подтвердите пароль";
        else if (values.password !== values.confirmPassword) e.confirmPassword = "Пароли не совпадают";

        // birthdate опционально, но если указан — проверим формат даты
        if (values.birthdate) {
            const d = new Date(values.birthdate);
            if (Number.isNaN(d.getTime())) e.birthdate = "Некорректная дата";
        }

        return e;
    };

    const onChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
        setServerError(null);
        setSuccess(null);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setServerError(null);
        const v = validate(form);
        setErrors(v);
        if (Object.keys(v).length) return; // есть ошибки

        setLoading(true);
        try {
            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                birthdate: form.birthdate || null,
                email: form.email.trim().toLowerCase(),
                password: form.password,
            };

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                // Предпочитаем показать сообщение от сервера, иначе универсальное
                const msg = (json && (json.error || json.message)) || `Ошибка: ${res.status}`;
                setServerError(msg);
                setLoading(false);
                return;
            }

            setSuccess((json && (json.message || "Успешно зарегистрированы!")) || "Успешно зарегистрированы!");
            setForm({ firstName: "", lastName: "", birthdate: "", email: "", password: "", confirmPassword: "" });
        } catch (err) {
            setServerError("Сетевая ошибка. Попробуйте ещё раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 gap-5 flex flex-col"
                aria-label="Форма регистрации"
            >
                <h2 className="text-lg font-semibold text-center">Регистрация</h2>

                <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Имя</span>
                        <input
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={onChange}
                            className={`input p-2 text-sm rounded-md border ${errors.firstName ? "border-red-400" : "border-gray-200"}`}
                            aria-invalid={!!errors.firstName}
                        />
                        {errors.firstName && <small className="text-red-500 mt-1">{errors.firstName}</small>}
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Фамилия</span>
                        <input
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={onChange}
                            className={`input p-2 text-sm rounded-md border ${errors.lastName ? "border-red-400" : "border-gray-200"}`}
                            aria-invalid={!!errors.lastName}
                        />
                        {errors.lastName && <small className="text-red-500 mt-1">{errors.lastName}</small>}
                    </label>
                </div>

                <label className="flex flex-col text-sm">
                    <span className="mb-1">Дата рождения (не обязательно)</span>
                    <input
                        id="birthdate"
                        name="birthdate"
                        value={form.birthdate}
                        onChange={onChange}
                        type="date"
                        className={`p-2 text-sm rounded-md border ${errors.birthdate ? "border-red-400" : "border-gray-200"}`}
                        aria-invalid={!!errors.birthdate}
                    />
                    {errors.birthdate && <small className="text-red-500 mt-1">{errors.birthdate}</small>}
                </label>

                <label className="flex flex-col text-sm">
                    <span className="mb-1">Email</span>
                    <input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        className={`p-2 text-sm rounded-md border ${errors.email ? "border-red-400" : "border-gray-200"}`}
                        aria-invalid={!!errors.email}
                        autoComplete="email"
                    />
                    {errors.email && <small className="text-red-500 mt-1">{errors.email}</small>}
                </label>

                <div className="flex flex-col gap-2">
                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Пароль</span>
                        <input
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            type="password"
                            className={`p-2 text-sm rounded-md border ${errors.password ? "border-red-400" : "border-gray-200"}`}
                            aria-invalid={!!errors.password}
                            autoComplete="new-password"
                        />
                        {errors.password && <small className="text-red-500 mt-1">{errors.password}</small>}
                    </label>

                    <label className="flex flex-col text-sm">
                        <span className="mb-1">Подтвердите пароль</span>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={onChange}
                            type="password"
                            className={`p-2 text-sm rounded-md border ${errors.confirmPassword ? "border-red-400" : "border-gray-200"}`}
                            aria-invalid={!!errors.confirmPassword}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <small className="text-red-500 mt-1">{errors.confirmPassword}</small>}
                    </label>
                </div>

                {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}

                <button
                    type="submit"
                    className="btn__circle big__button  bg-blue-600"
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? "Отправка..." : "Зарегистрироваться"}
                </button>

            </form>
        </div>
    );
}
