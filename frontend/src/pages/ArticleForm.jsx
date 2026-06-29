import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, getArticleById, updateArticle } from "../api/article.api";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";

const EMPTY = { title: "", content: "", excerpt: "", cover_image: "", status: "draft" };

const ArticleForm = () => {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const { addToast } = useToast();
    const isEditing    = Boolean(id);

    const [form, setForm]       = useState(EMPTY);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEditing) return;
        getArticleById(id)
            .then((res) => setForm(res.data.data))
            .catch(() => setError("Article introuvable."));
    }, [id, isEditing]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (isEditing) {
                await updateArticle(id, form);
                addToast("Article mis à jour.", "success");
                navigate(`/articles/${id}`);
            } else {
                const res = await createArticle(form);
                addToast("Article publié avec succès !", "success");
                navigate(`/articles/${res.data.article.id}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page anim-fade-up">
            <h1 className="form-page__title">
                {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h1>

            {error && <div className="form-error" style={{ marginBottom: 24 }}>{error}</div>}

            <form onSubmit={handleSubmit} className="form-stack">
                <div className="form-group">
                    <label className="form-label">Titre *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Un titre accrocheur…"
                        style={{ fontSize: 17, fontFamily: "var(--font-display)", fontWeight: 600 }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Extrait</label>
                    <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        className="form-input form-textarea"
                        rows={2}
                        placeholder="Un résumé en une ou deux phrases…"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Contenu *</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        className="form-input form-textarea"
                        rows={14}
                        placeholder="Votre article commence ici…"
                        style={{ lineHeight: 1.75 }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Image de couverture</label>
                    <ImageUploader
                        value={form.cover_image}
                        onChange={(url) => setForm((prev) => ({ ...prev, cover_image: url }))}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="form-input form-select"
                    >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
                    <button type="submit" disabled={loading} className="btn btn--primary btn--lg">
                        {loading ? "Enregistrement…" : isEditing ? "Mettre à jour" : "Publier"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn--outline btn--lg">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
