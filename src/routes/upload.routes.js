const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const upload         = require("../middlewares/upload.middleware");

router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu." });
        }
        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(201).json({ url });
    }
);

router.use((err, _req, res, _next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Fichier trop lourd (max 5 Mo)." });
    }
    res.status(400).json({ error: err.message });
});

module.exports = router;
