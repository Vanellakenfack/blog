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

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
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