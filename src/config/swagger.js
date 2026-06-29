const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Blog API",
        version: "1.0.0",
        description: "API de blog professionnelle"
    },

    // 🔐 AUTH JWT
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    tags: [
        {
            name: "Auth",
            description: "Authentification"
        },
        {
            name: "Articles",
            description: "Gestion des articles"
        }
    ],
    // Note: security is not set globally so unprotected routes won't show the lock.

    // 🌐 serveur API
    servers: [
        {
            url: "http://localhost:3000/api"
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};