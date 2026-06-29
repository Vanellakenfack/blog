import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const [open, setOpen]  = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setOpen(false);
    };

    const close = () => setOpen(false);

    const AuthLinks = ({ mobile = false }) => user ? (
        <>
            {mobile && (
                <span className="navbar__mobile-user">
                    {user.email}
                    <span className="badge badge--accent">{user.role}</span>
                </span>
            )}
            {!mobile && (
                <span className="navbar__user-info">
                    {user.email}
                    <span className="badge badge--accent">{user.role}</span>
                </span>
            )}
            <Link to="/articles/new" className="btn btn--primary" onClick={close}>+ Écrire</Link>
            <button onClick={handleLogout} className="btn btn--ghost">Sortir</button>
        </>
    ) : (
        <>
            <Link to="/login"    className="btn btn--ghost"    onClick={close}>Connexion</Link>
            <Link to="/register" className="btn btn--primary"  onClick={close}>Inscription</Link>
        </>
    );

    return (
        <nav className="navbar">
            <div className="wrap">
                <div className="navbar__inner">
                    <Link to="/" className="navbar__logo" onClick={close}>
                        kmvanoublog<em>.</em>
                    </Link>

                    <div className="navbar__links">
                        <AuthLinks />
                    </div>

                    <button
                        className={`navbar__hamburger ${open ? "open" : ""}`}
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>

                <div className={`navbar__mobile-menu ${open ? "open" : ""}`}>
                    <AuthLinks mobile />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
