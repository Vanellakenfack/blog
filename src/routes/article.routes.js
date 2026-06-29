const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const articleController = require("../controllers/article.controller");
/**
 * @swagger
 * /articles:
 *   security:
 *     - bearerAuth: []
 *   post:
 *     tags:
 *       - Articles
 *     summary : Créer un nouvel article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Erreur de validation
 */

router.post("/articles", authMiddleware , articleController.createArticle);

/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupérer tous les articles
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get("/articles", articleController.getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     tags:
 *      - Articles
 *     summary: Récupérer un article par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get("/articles/:id", articleController.getArticleById);
/**
 * 
 * @swagger
 * /articles/{id}:
 *   delete:
 *     tags:
 *      - Articles
 *     summary: Supprimer un article par son ID (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Article supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Article non trouvé
 */
router.delete(
    "/articles/:id",
    authMiddleware,
    articleController.deleteArticle
);


/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Mettre à jour un article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Article introuvable
 */
router.put("/articles/:id", authMiddleware, articleController.updateArticle);

router.get("/articles/:id/similar", articleController.getSimilarArticles);

module.exports = router;