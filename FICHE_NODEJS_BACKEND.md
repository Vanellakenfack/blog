# Fiche d'apprentissage — Node.js & Bonnes pratiques Backend

---

## 1. Architecture en couches (le pattern essentiel)

```
Request HTTP
    ↓
[ Route ]          → définit l'URL et le middleware
    ↓
[ Controller ]     → reçoit req/res, délègue, renvoie la réponse
    ↓
[ Service ]        → contient la logique métier (règles, validations)
    ↓
[ Repository ]     → seul endroit qui parle à la base de données
    ↓
[ Base de données ]
```

**Règle d'or** : chaque couche ne parle qu'à la couche du dessous. Le controller ne touche jamais la BDD. Le repository ne connaît pas les règles métier.

---

## 2. Variables d'environnement

**Ne jamais mettre de secrets dans le code.**

```js
// ❌ Mauvais
jwt.sign(payload, "SECRET_KEY");

// ✅ Bien
jwt.sign(payload, process.env.JWT_SECRET);
```

**Fichier `.env`** (jamais commité dans git) :
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=monmotdepasse
DB_NAME=blog
JWT_SECRET=une_cle_longue_et_aleatoire_min_32_chars
PORT=3000
```

**Fichier `.env.example`** (commité, sans valeurs sensibles) :
```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=
```

Charger dans `server.js` ou `app.js` en tout premier :
```js
require("dotenv").config();
```

---

## 3. Sécurité — les incontournables

### 3.1 Hachage des mots de passe
```js
const bcrypt = require("bcryptjs");

// À l'inscription — jamais stocker le mot de passe en clair
const hashedPassword = await bcrypt.hash(password, 10); // 10 = coût

// À la connexion
const isMatch = await bcrypt.compare(passwordSaisi, hashEnBDD);
```

### 3.2 JWT (JSON Web Token)
```js
// Créer un token (à la connexion)
const token = jwt.sign(
    { id: user.id, role: user.role },   // payload (données non sensibles)
    process.env.JWT_SECRET,              // clé secrète
    { expiresIn: "1d" }                  // durée de vie
);

// Vérifier un token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // disponible dans les routes suivantes
```

### 3.3 Requêtes SQL paramétrées (anti-injection SQL)
```js
// ❌ Dangereux — injection SQL possible
pool.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Sûr — paramètres séparés
pool.query("SELECT * FROM users WHERE email = $1", [email]);
```

---

## 4. Gestion des erreurs

### 4.1 Principe : throw dans le service, catch dans le controller
```js
// service.js — lance l'erreur
const getArticleById = async (id) => {
    const article = await articleRepository.getArticleById(id);
    if (!article) {
        throw new Error("Article introuvable"); // le service décide de l'erreur
    }
    return article;
};

// controller.js — attrape et répond
const getArticleById = async (req, res) => {
    try {
        const article = await articleService.getArticleById(req.params.id);
        res.status(200).json({ data: article });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
```

### 4.2 Codes HTTP à retenir
| Code | Signification              | Quand l'utiliser                        |
|------|----------------------------|-----------------------------------------|
| 200  | OK                         | Succès GET, PUT, DELETE                 |
| 201  | Created                    | Succès POST (création)                  |
| 400  | Bad Request                | Données invalides envoyées par l'user   |
| 401  | Unauthorized               | Token manquant ou invalide              |
| 403  | Forbidden                  | Authentifié mais pas le droit           |
| 404  | Not Found                  | Ressource introuvable                   |
| 500  | Internal Server Error      | Erreur inattendue côté serveur          |

---

## 5. Middleware

Un middleware est une fonction qui s'exécute entre la requête et la réponse.

```js
// Signature d'un middleware
const monMiddleware = (req, res, next) => {
    // faire quelque chose...
    next(); // passer au suivant (OBLIGATOIRE sauf si on répond)
};

// Middleware d'authentification — pattern classique
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Token invalide" });
    }
};

// Middleware de rôle — factory function (retourne un middleware)
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
};

// Utilisation dans les routes
router.delete("/articles/:id",
    authMiddleware,             // 1. vérifie le token
    roleMiddleware("admin"),    // 2. vérifie le rôle
    articleController.delete    // 3. exécute la logique
);
```

---

## 6. Validation des données

Toujours valider ce qui vient de l'extérieur (req.body, req.params, req.query).

```js
// ❌ Pas de validation — risque de crash ou mauvaises données en BDD
const createArticle = async (data, user) => {
    return await articleRepository.create(data);
};

// ✅ Valider avant d'agir
const createArticle = async (data, user) => {
    const { title, content, status } = data;

    if (!title || !content) {
        throw new Error("Titre et contenu obligatoires");
    }

    const allowedStatus = ["draft", "published"];
    const finalStatus = status || "draft";
    if (!allowedStatus.includes(finalStatus)) {
        throw new Error("Statut invalide");
    }

    // ... suite
};
```

---

## 7. Pagination

Pattern standard pour les listes :

```js
// Requête client : GET /articles?page=2&limit=10&status=published

// Controller — lire les paramètres avec des valeurs par défaut
const page  = parseInt(req.query.page)  || 1;
const limit = parseInt(req.query.limit) || 10;

// Service — calculer l'offset
const offset = (page - 1) * limit;
const items  = await repository.getAll(limit, offset);
const total  = await repository.count();

return {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
};

// Repository — SQL avec filtre optionnel
const getAll = async (limit, offset, status) => {
    const result = await pool.query(
        `SELECT * FROM articles
         WHERE ($1::text IS NULL OR status = $1::text)
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [status ?? null, limit, offset]
    );
    return result.rows;
};
```

---

## 8. Structure de projet recommandée

```
blog-api/
├── .env                        ← secrets locaux (jamais dans git)
├── .env.example                ← template sans valeurs (dans git)
├── .gitignore                  ← inclure .env et node_modules
├── package.json
├── server.js                   ← point d'entrée, app.listen()
├── migrations/                 ← scripts SQL pour créer les tables
│   ├── 001_create_users.sql
│   └── 002_create_articles.sql
└── src/
    ├── app.js                  ← config express, middlewares globaux
    ├── config/
    │   ├── db.js               ← connexion à la BDD
    │   └── swagger.js
    ├── routes/                 ← définition des URLs
    ├── controllers/            ← req/res uniquement
    ├── services/               ← logique métier
    ├── repositories/           ← accès BDD uniquement
    └── middlewares/            ← auth, rôle, validation...
```

---

## 9. Checklist avant de considérer une API prête

- [ ] Aucun secret dans le code (tout dans `.env`)
- [ ] Mots de passe hachés avec bcrypt
- [ ] Paramètres SQL toujours paramétrés (pas de concaténation)
- [ ] Token JWT vérifié sur toutes les routes protégées
- [ ] Données entrantes validées (body, params, query)
- [ ] Codes HTTP corrects (201 pour création, 401 vs 403, etc.)
- [ ] Toutes les fonctions async/await ont un try/catch (ou un handler global)
- [ ] `.env` dans `.gitignore`
- [ ] Migrations SQL cohérentes avec le code (mêmes colonnes)

---

## 10. Erreurs fréquentes à éviter

| Erreur | Problème | Solution |
|--------|----------|----------|
| Oublier un paramètre dans une fonction | `ReferenceError` au runtime | Vérifier la signature de chaque fonction |
| Appeler le service deux fois | Double requête BDD | Une seule variable, dans le `try` |
| Filtre en service mais pas en repository | Résultats incohérents | Passer le filtre jusqu'à la requête SQL |
| Clé JWT en dur | Fuite si le code est public | `process.env.JWT_SECRET` |
| Migration incomplète | Colonnes manquantes en BDD | Synchroniser migration et repository |
| Toujours renvoyer 400 ou 500 | Mauvais diagnostic pour le client | Choisir le bon code HTTP |
