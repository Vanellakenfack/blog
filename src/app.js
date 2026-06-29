const express     = require("express");
const cors        = require("cors");
const path        = require("path");
const helmet      = require("helmet");
const compression = require("compression");
const morgan      = require("morgan");
const app         = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan("dev"));

// On récupère l'URL du frontend depuis les variables d'environnement, avec les localhost par défaut
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    process.env.FRONTEND_URL // Cette variable contiendra l'URL de votre site React en ligne
];

app.use(cors({
    origin: function (origin, callback) {
        // Autorise les requêtes sans origine (comme Postman ou les outils de test) 
        // ou si l'origine est dans notre liste autorisée
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Bloqué par les restrictions CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const { swaggerUi, swaggerSpec } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const articleRoutes = require("./routes/article.routes");
const authRoutes    = require("./routes/auth.routes");
const uploadRoutes  = require("./routes/upload.routes");

app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);

module.exports = app;