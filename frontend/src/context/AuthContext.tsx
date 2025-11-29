import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Проверяем текущего пользователя
    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/me", { credentials: "include" });
            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && json.detail === "Not authenticated") {
                    setUser(null);
                } else {
                    setUser(null);
                }
            } else {
                setUser(json);
            }
        } catch (err) {
            // Сетевая ошибка — уверенно ставим null
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Функция входа: вызывает /api/auth/login, затем обновляет user
    const login = async ({ email, password }) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error((json && (json.error || json.message)) || `Ошибка: ${res.status}`);
            }

            // После успешного логина обновим информацию о пользователе
            await fetchCurrentUser();
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message || "Ошибка при входе" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            // игнорируем ошибку
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refresh: fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}