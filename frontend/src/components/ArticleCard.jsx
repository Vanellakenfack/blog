import { Link } from "react-router-dom";

const GRADIENTS = [
    "linear-gradient(135deg, #1a1208 0%, #2d1f0a 100%)",
    "linear-gradient(135deg, #0a1a12 0%, #0d2b1a 100%)",
    "linear-gradient(135deg, #0f0a1a 0%, #1a0d2b 100%)",
    "linear-gradient(135deg, #1a0a0a 0%, #2b0d0d 100%)",
    "linear-gradient(135deg, #0a0f1a 0%, #0d172b 100%)",
    "linear-gradient(135deg, #1a150a 0%, #2b200d 100%)",
];

export const gradientFor = (title = "") => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

const readingTime = (text = "") => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

const ArticleCard = ({ article, index = 0 }) => {
    const date    = new Date(article.created_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", year: "numeric",
    });
    const minutes = readingTime(article.content || "");

    return (
        <Link
            to={`/articles/${article.id}`}
            className="card anim-fade-up"
            style={{ animationDelay: `${index * 70}ms` }}
        >
            <div className="card__media" style={!article.cover_image ? { background: gradientFor(article.title) } : {}}>
                {article.cover_image
                    ? <img src={article.cover_image} alt={article.title} className="card__img" />
                    : <div className="card__placeholder">{article.title?.[0]?.toUpperCase()}</div>
                }
            </div>
            <div className="card__body">
                <div className="card__meta">
                    <span className={`badge ${article.status === "published" ? "badge--green" : "badge--gray"}`}>
                        {article.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                    <span className="card__date">{date}</span>
                    <span className="card__date">{minutes} min</span>
                </div>
                <h2 className="card__title">{article.title}</h2>
                {article.excerpt && <p className="card__excerpt">{article.excerpt}</p>}
                <span className="card__cta">Lire →</span>
            </div>
        </Link>
    );
};

export default ArticleCard;
