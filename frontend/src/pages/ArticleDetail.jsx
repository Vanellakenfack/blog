import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticleById, deleteArticle, getSimilarArticles } from "../api/article.api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { gradientFor } from "../components/ArticleCard";

const readingTime = (text = "") => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
};

const ShareButton = ({ title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`share-btn ${copied ? "share-btn--copied" : ""}`}
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {copied ? "Lien copié !" : "Partager"}
        </button>
    );
};

const SimilarCard = ({ article }) => {
    const date = new Date(article.created_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", year: "numeric",
    });
    return (
        <Link to={`/articles/${article.id}`} className="similar-card">
            {article.cover_image
                ? <img src={article.cover_image} alt={article.title} className="similar-card__thumb" />
                : <div className="similar-card__thumb-placeholder" style={{ background: gradientFor(article.title) }}>
                    {article.title?.[0]?.toUpperCase()}
                  </div>
            }
            <p className="similar-card__title">{article.title}</p>
            <p className="similar-card__date">{date}</p>
        </Link>
    );
};

const ArticleDetail = () => {
    const { id }        = useParams();
    const { user }      = useAuth();
    const { addToast }  = useToast();
    const navigate      = useNavigate();

    const [article, setArticle]   = useState(null);
    const [similar, setSimilar]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getArticleById(id),
            getSimilarArticles(id),
        ])
            .then(([artRes, simRes]) => {
                setArticle(artRes.data.data);
                setSimilar(simRes.data.data);
            })
            .catch(() => setError("Article introuvable."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Supprimer cet article définitivement ?")) return;
        try {
            await deleteArticle(id);
            addToast("Article supprimé.", "success");
            navigate("/");
        } catch {
            addToast("Impossible de supprimer l'article.", "error");
        }
    };

    const canEdit = user && (user.role === "admin" || user.id === article?.author_id);

    if (loading) return <p className="state-empty">Chargement…</p>;
    if (error)   return <p className="state-empty state-empty--error">{error}</p>;

    const date = new Date(article.created_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
    });
    const minutes = readingTime(article.content);

    return (
        <article className="detail anim-fade-up">
            <Link to="/" className="detail__back">← Retour</Link>

            {article.cover_image
                ? <img src={article.cover_image} alt={article.title} className="detail__cover" />
                : <div className="detail__cover-placeholder" style={{ background: gradientFor(article.title) }}>
                    {article.title?.[0]?.toUpperCase()}
                  </div>
            }

            <div className="detail__meta">
                <span className={`badge ${article.status === "published" ? "badge--green" : "badge--gray"}`}>
                    {article.status === "published" ? "Publié" : "Brouillon"}
                </span>
                <span className="detail__date">{date}</span>
            </div>

            <h1 className="detail__title">{article.title}</h1>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
                <div className="article-stats">
                    <span>{minutes} min de lecture</span>
                    <span className="article-stats__dot">·</span>
                    <span>{article.views ?? 0} vue{article.views !== 1 ? "s" : ""}</span>
                </div>
                <ShareButton title={article.title} />
            </div>

            {article.excerpt && (
                <blockquote className="detail__excerpt">{article.excerpt}</blockquote>
            )}

            <hr className="detail__rule" />

            <div className="detail__content">{article.content}</div>

            {canEdit && (
                <div className="detail__actions">
                    <Link to={`/articles/${id}/edit`} className="btn btn--primary">Modifier</Link>
                    <button onClick={handleDelete} className="btn btn--danger">Supprimer</button>
                </div>
            )}

            {similar.length > 0 && (
                <div className="similar">
                    <p className="similar__title">À lire aussi</p>
                    <div className="similar__grid">
                        {similar.map((a) => <SimilarCard key={a.id} article={a} />)}
                    </div>
                </div>
            )}
        </article>
    );
};

export default ArticleDetail;
