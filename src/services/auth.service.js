const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");

const register = async (data) => {
    const { name, email, password } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error("Email déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await userRepository.createUser(name, email, hashedPassword);
};

const login = async (data) => {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Mot de passe incorrect");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
};

module.exports = {
    register,
    login
};