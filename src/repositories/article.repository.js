const pool = require("../config/db");

const createArticle = async (
    title,
    slug,
    excerpt,
    content,
    cover_image,
    status,
    author_id
) => {
    const result = await pool.query(
        `INSERT INTO articles
        (title, slug, excerpt, content, cover_image, status, author_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [title, slug, excerpt, content, cover_image, status, author_id]
    );

    return result.rows[0];
};

const countArticles = async (status, q) => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM articles
         WHERE ($1::text IS NULL OR status = $1::text)
           AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%' OR excerpt ILIKE '%' || $2 || '%')`,
        [status || null, q || null]
    );
    return parseInt(result.rows[0].count);
};




const getAllArticles = async (limit, offset, status, q) => {
    const result = await pool.query(
        `SELECT * FROM articles
         WHERE ($3::text IS NULL OR status = $3::text)
           AND ($4::text IS NULL OR title ILIKE '%' || $4 || '%' OR excerpt ILIKE '%' || $4 || '%')
         ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset, status || null, q || null]
    );
    return result.rows;
};


const getArticleById = async (id) => {
    const result = await pool.query(
        "UPDATE articles SET views = views + 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

const getSimilarArticles = async (excludeId, limit = 3) => {
    const result = await pool.query(
        `SELECT id, title, slug, excerpt, cover_image, created_at
         FROM articles
         WHERE status = 'published' AND id != $1
         ORDER BY RANDOM()
         LIMIT $2`,
        [excludeId, limit]
    );
    return result.rows;
};

const deleteArticle = async (id) => {
    await pool.query(
        "DELETE FROM articles WHERE id = $1",
        [id]
    );
};

const updateArticle = async (id, article) => {
    const result = await pool.query(
        `
        UPDATE articles
        SET title = $1,
            slug = $2,
            excerpt = $3,
            content = $4,
            cover_image = $5,
            status = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING *
        `,
        [
            article.title,
            article.slug,
            article.excerpt,
            article.content,
            article.cover_image,
            article.status,
            id
        ]
    );

    return result.rows[0];
};
module.exports = {
    createArticle,
    countArticles,
    getAllArticles,
    getArticleById,
    getSimilarArticles,
    deleteArticle,
    updateArticle,
};