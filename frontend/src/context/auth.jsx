import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/auth";
import { getMe } from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // login("a", "aaaaaaA1")
        getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function login(userLogin, password) {
        await apiLogin(userLogin, password);
        setUser(await getMe());
    }

    async function logout() {
        await apiLogout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}