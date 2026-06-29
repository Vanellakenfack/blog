const app = require("./src/app");

// On utilise le port fourni par Render, ou le port 3000 par défaut en local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
