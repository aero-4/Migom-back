import { useState, useEffect, useRef, createContext, useContext } from "react";
import config from "../../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const refreshIntervalRef = useRef(null);

    const hasTokensInCookies = () =>
        typeof document !== "undefined" &&
        (/(\b|;)access_token=/.test(document.cookie) || /(\b|;)refresh_token=/.test(document.cookie));

    const handleNotAuthenticated = () => {
        setUser(null);
        setIsAuthenticated(false);
        window.alert("Вам нужно заново авторизоваться");
        window.location.assign("/login");
    };

    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            if (!hasTokensInCookies()) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            const res = await fetch(config.API_URL + "/api/users/me", { credentials: "include" });
            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && json.detail === "Not authenticated") {
                    handleNotAuthenticated();
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(json);
                setIsAuthenticated(true);
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            if (!hasTokensInCookies()) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
            const res = await fetch(config.API_URL + "/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });
            const json = await res.json().catch(() => null);

            if (!res.ok) {
                if (json && json.detail === "Not authenticated") {
                    handleNotAuthenticated();
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
                return;
            }

            await fetchCurrentUser();
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            refreshToken();
            refreshIntervalRef.current = setInterval(() => {
                refreshToken();
            }, 15 * 60 * 1000);
        } else {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        }
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [isAuthenticated]);

    const setCookie = (name, value, opts = {}) => {
        if (typeof document === "undefined") return;
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        if (opts.maxAge) cookie += `; max-age=${opts.maxAge}`;
        if (opts.expires) cookie += `; expires=${opts.expires.toUTCString()}`;
        if (opts.path) cookie += `; path=${opts.path}`;
        else cookie += `; path=/`;
        if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
        if (opts.secure) cookie += `; Secure`;
        document.cookie = cookie;
    };

    const login = async ({ email, password }) => {
        try {
            const res = await fetch(config.API_URL + "/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });


            console.log(res.headers)

            const json = await res.json().catch(() => null);


            if (!res.ok) {
                console.log(json.detail)
                if (json && json.detail)
                    return { ok: false, message: json.detail };
                return { ok: false, message: (json && (json.error || json.message)) || `Ошибка: ${res.status}` };
            }

            if (json && json.msg && String(json.msg).toLowerCase().includes("login success")) {
                setIsAuthenticated(true);
                await fetchCurrentUser();
                return { ok: true };
            }

            setIsAuthenticated(true);
            await fetchCurrentUser();
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message || "Ошибка при входе" };
        }
    };

    const logout = async () => {
        try {
            await fetch(config.API_URL + "/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {

        }
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                refresh: fetchCurrentUser,
                setAuthenticated: setIsAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
