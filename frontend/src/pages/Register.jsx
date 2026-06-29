import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/auth.api";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm]       = useState({ name: "", email: "", password: "" });
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await registerApi(form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card anim-fade-up">
                <h1 className="auth-title">Inscription</h1>
                <p className="auth-sub">Créez votre espace auteur.</p>

                {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}

                <form onSubmit={handleSubmit} className="form-stack">
                    <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Jean Dupont"
                        />
                    </div>
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
                            minLength={6}
                            className="form-input"
                            placeholder="Min. 6 caractères"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn--primary btn--lg btn--full"
                        style={{ marginTop: 4 }}
                    >
                        {loading ? "Création…" : "Créer mon compte"}
                    </button>
                </form>

                <p className="auth-foot">
                    Déjà un compte ?{" "}
                    <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
