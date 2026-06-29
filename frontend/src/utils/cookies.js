const TOKEN_KEY = "token";
const MAX_AGE   = 60 * 60 * 24; // 1 jour en secondes (correspond à l'expiry JWT)

export const setTokenCookie = (token) => {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
};

export const getTokenCookie = () => {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_KEY}=`));
    return match ? match.split("=")[1] : null;
};

export const removeTokenCookie = () => {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};
