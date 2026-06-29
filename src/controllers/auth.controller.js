const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            message: "Utilisateur créé",
            user
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);

        res.status(200).json({
            message: "Connexion réussie",
            token
        });
    } catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};