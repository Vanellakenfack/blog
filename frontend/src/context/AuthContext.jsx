import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setTokenCookie, getTokenCookie, removeTokenCookie } from "../utils/cookies";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getTokenCookie();
        if (token) {
            try {
                setUser(jwtDecode(token));
            } catch {
                removeTokenCookie();
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        setTokenCookie(token);
        setUser(jwtDecode(token));
    };

    const logout = () => {
        removeTokenCookie();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return ctx;
};
