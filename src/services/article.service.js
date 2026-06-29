const articleRepository = require("../repositories/article.repository");
const slugify = require("slugify");

const createArticle = async (data, user) => {
    const {
        title,
        content,
        excerpt,
        cover_image,
        status
    } = data;

    const authorId = user.id;

    if (!title || !content) {
        throw new Error("Titre et contenu obligatoires");
    }

    const allowedStatus = ["draft", "published"];
    const finalStatus = status || "draft";

    if (!allowedStatus.includes(finalStatus)) {
        throw new Error("Statut invalide");
    }

    const slug = slugify(title, {
        lower: true,
        strict: true
    });

    return await articleRepository.createArticle(
        title,
        slug,
        excerpt,
        content,
        cover_image,
        finalStatus,
        authorId
    );
};

const getArticles = async (page, limit, status, q) => {
    const offset    = (page - 1) * limit;
    const result    = await articleRepository.getAllArticles(limit, offset, status, q);
    const total     = await articleRepository.countArticles(status, q);
    const totalpage = Math.ceil(total / limit);

    return { article: result, page, limit, total, totalpage };
};

const getArticleById = async (id) => {
    const article = await articleRepository.getArticleById(id);

    if (!article) {
        throw new Error("Article introuvable");
    }

    return article;
};

const deleteArticle = async (id, user) => {
    const article = await articleRepository.getArticleById(id);

    if (!article) {
        throw new Error("Article introuvable");
    }

    const isAdmin = user.role === "admin";
    const isOwner = article.author_id === user.id;

    if (!isAdmin && !isOwner) {
    throw new Error("Accès refusé");
}

    await articleRepository.deleteArticle(id);
};

const updateArticle = async (id, data, user) => {
    const article = await articleRepository.getArticleById(id);

    if (!article) {
        throw new Error("Article introuvable");
    }

    const isOwner = article.author_id === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new Error("Accès refusé");
    }

    const {
        title,
        content,
        excerpt,
        cover_image,
        status
    } = data;

    const updatedSlug = title
        ? slugify(title, { lower: true, strict: true })
        : article.slug;

    const updatedArticle = {
        title: title || article.title,
        content: content || article.content,
        excerpt: excerpt || article.excerpt,
        cover_image: cover_image || article.cover_image,
        status: status || article.status,
        slug: updatedSlug
    };

    return await articleRepository.updateArticle(id, updatedArticle);
};
const getSimilarArticles = async (id) =>
    articleRepository.getSimilarArticles(id, 3);

module.exports = {
    createArticle,
    getArticles,
    getArticleById,
    getSimilarArticles,
    deleteArticle,
    updateArticle,
};