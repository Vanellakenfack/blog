const express   = require("express");
const router    = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/auth.controller");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: "Trop de tentatives. Réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", authLimiter, authController.register);
/**
 @swagger
 * /register:
 *  post:
 *     tags:
 *       - Auth
 *     summary: Enregistrer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/login", authLimiter, authController.login);
/**
 @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connecter un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
module.exports = router;