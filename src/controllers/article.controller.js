const articleService = require("../services/article.service");

const createArticle = async (req, res) => {
    try {
        const article = await articleService.createArticle(req.body,req.user);

        res.status(201).json({
            message: "Article créé",
            article
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};

const getArticles = async (req, res) => {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;
    const q      = req.query.q     || null;

    try {
        const articles = await articleService.getArticles(page, limit, status, q);

        res.status(200).json({
            message: "Liste des articles",
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            error: "Erreur serveur"
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const id = req.params.id;

        const article = await articleService.getArticleById(id);

        res.status(200).json({
            message: "Article trouvé",
            data: article
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        await articleService.deleteArticle(
            req.params.id,
            req.user
        );

        res.status(200).json({
            message: "Article supprimé"
        });
    } catch (error) {
        res.status(403).json({
            error: error.message
        });
    }
};
const updateArticle = async (req, res) => {
    try {
        const article = await articleService.updateArticle(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            message: "Article mis à jour",
            data: article
        });
    } catch (error) {
        res.status(403).json({
            error: error.message
        });
    }
};
const getSimilarArticles = async (req, res) => {
    try {
        const articles = await articleService.getSimilarArticles(req.params.id);
        res.status(200).json({ data: articles });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    createArticle,
    getArticles,
    getArticleById,
    getSimilarArticles,
    deleteArticle,
    updateArticle,
};