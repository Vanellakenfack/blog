import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const ICONS = {
    success: "✓",
    error:   "✕",
    info:    "i",
};

const Toast = ({ toast, onRemove }) => (
    <div className={`toast toast--${toast.type}`} onClick={() => onRemove(toast.id)}>
        <span className="toast__icon">{ICONS[toast.type]}</span>
        <span className="toast__msg">{toast.message}</span>
    </div>
);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) =>
        setToasts((prev) => prev.filter((t) => t.id !== id)), []);

    const addToast = useCallback((message, type = "info") => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => remove(id), 4000);
    }, [remove]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <Toast key={t.id} toast={t} onRemove={remove} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast doit être dans ToastProvider");
    return ctx;
};
