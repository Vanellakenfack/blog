import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/article.api";
import ArticleCard, { gradientFor } from "../components/ArticleCard";
import Pagination from "../components/Pagination";

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
    </svg>
);

const FeaturedArticle = ({ article }) => {
    const date = new Date(article.created_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
    });
    return (
        <Link to={`/articles/${article.id}`} className="featured anim-fade-up">
            <div className="featured__media" style={!article.cover_image ? { background: gradientFor(article.title) } : {}}>
                {article.cover_image
                    ? <img src={article.cover_image} alt={article.title} className="featured__img" />
                    : <div className="featured__placeholder">{article.title?.[0]?.toUpperCase()}</div>
                }
            </div>
            <div className="featured__body">
                <p className="featured__label">— À la une</p>
                <h2 className="featured__title">{article.title}</h2>
                {article.excerpt && <p className="featured__excerpt">{article.excerpt}</p>}
                <p className="featured__date">{date}</p>
            </div>
        </Link>
    );
};

const Home = () => {
    const [articles, setArticles]     = useState([]);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [search, setSearch]         = useState("");
    const [query, setQuery]           = useState("");

    // debounce: attend 400ms après la frappe avant de lancer la recherche
    useEffect(() => {
        const t = setTimeout(() => {
            setQuery(search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = { page, limit: query ? 6 : 7, status: "published" };
                if (query) params.q = query;
                const res = await getArticles(params);
                setArticles(res.data.data.article);
                setTotalPages(res.data.data.totalpage);
            } catch {
                setError("Impossible de charger les articles.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [page, query]);

    const isSearching        = query.length > 0;
    const [featured, ...rest] = isSearching ? [null] : articles;

    return (
        <main>
            <div className="wrap">
                <header className="home-header">
                    <div>
                        <h1 className="home-title">
                            Dernières<br /><em>publications</em>
                        </h1>
                        <p className="home-subtitle">Idées, récits et réflexions</p>
                    </div>
                    <div className="search-wrap">
                        <SearchIcon />
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Rechercher un article…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                {loading && (
                    <>
                        {!isSearching && <div className="skeleton" style={{ height: 340, marginBottom: 56 }} />}
                        <div className="articles-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: 260 }} />
                            ))}
                        </div>
                    </>
                )}

                {error && <p className="state-empty state-empty--error">{error}</p>}

                {!loading && !error && articles.length === 0 && (
                    <p className="state-empty">
                        {isSearching
                            ? `Aucun résultat pour « ${query} ».`
                            : "Aucun article publié pour l'instant."}
                    </p>
                )}

                {!loading && !error && articles.length > 0 && (
                    <>
                        {!isSearching && featured && <FeaturedArticle article={featured} />}

                        {(isSearching ? articles : rest).length > 0 && (
                            <>
                                <p className="section-label">
                                    {isSearching ? `Résultats pour « ${query} »` : "Autres articles"}
                                </p>
                                <div className="articles-grid">
                                    {(isSearching ? articles : rest).map((article, i) => (
                                        <ArticleCard key={article.id} article={article} index={i} />
                                    ))}
                                </div>
                            </>
                        )}

                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </main>
    );
};

export default Home;
