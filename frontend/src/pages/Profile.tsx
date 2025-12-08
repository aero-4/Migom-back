import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../../config";

function Profile(): JSX.Element {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // форма смены пароля
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState(false);

    const MIN_PASSWORD_LENGTH = 6;

    const changePasswordHandle = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        setSuccess(null);

        // базовая валидация
        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            setError("Заполните все поля.");
            return;
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            setError(`Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`);
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            setError("Подтверждение пароля не совпадает.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(config.API_URL + "/api/users/password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                // вынесем удобную ошибку
                const msg =
                    (json && (json.detail || json.error || json.message)) ||
                    `Ошибка: ${res.status}`;
                setError(msg);
                return;
            }

            // успех — обычно безопаснее попросить пользователя заново залогиниться
            setSuccess("Пароль успешно изменён. Выполняется выход...");
            // маленькая задержка, чтобы пользователь успел увидеть сообщение
            setTimeout(async () => {
                try {
                    await logout();
                } catch (err) {
                    console.warn("logout after password change failed", err);
                }
                navigate("/login");
            }, 900);
        } catch (err: any) {
            console.error("changePassword error", err);
            setError(err?.message || "Ошибка при смене пароля");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div>
                <NavLink to="/login" className="big__button w-full">
                    Войти
                </NavLink>
            </div>
        );
    }

    return (
        <>
            <h1 className="title justify-start">Профиль</h1>

            <div className="card gap-9 items-center text-center">
                <div className="justify-center flex flex-row gap-1">
                    <p>{user.first_name}</p>
                    <p>{user.last_name}</p>
                </div>
                <p>{user.birthday}</p>
                <p>{user.email}</p>

                <div className="w-full max-w-md">
                    <form onSubmit={changePasswordHandle} className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold">Сменить пароль</h2>

                        {error && <div className="text-red-600">{error}</div>}
                        {success && <div className="text-green-600">{success}</div>}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Текущий пароль</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input"
                                placeholder="Введите текущий пароль"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Новый пароль</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input"
                                placeholder="Новый пароль"
                                minLength={MIN_PASSWORD_LENGTH}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Подтвердите новый пароль</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                className="input"
                                placeholder="Повторите новый пароль"
                                minLength={MIN_PASSWORD_LENGTH}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={showPasswords}
                                    onChange={() => setShowPasswords((s) => !s)}
                                />
                                Показать пароли
                            </label>

                            <button
                                type="submit"
                                className="big__button"
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading ? "Сохраняем..." : "Сменить пароль"}
                            </button>

                            <button
                                type="button"
                                className="big__button"
                                onClick={async () => {
                                    // быстрый выход
                                    await logout();
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
