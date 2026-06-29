import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate  = useNavigate();

    const [form, setForm]       = useState({ email: "", password: "" });
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await loginApi(form);
            login(res.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card anim-fade-up">
                <h1 className="auth-title">Connexion</h1>
                <p className="auth-sub">Bienvenue. Entrez vos identifiants.</p>

                {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}

                <form onSubmit={handleSubmit} className="form-stack">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="vous@exemple.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn--primary btn--lg btn--full"
                        style={{ marginTop: 4 }}
                    >
                        {loading ? "Connexion…" : "Se connecter"}
                    </button>
                </form>

                <p className="auth-foot">
                    Pas de compte ?{" "}
                    <Link to="/register">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
