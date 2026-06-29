import api from "./axios";

export const getArticles    = (params)   => api.get("/articles", { params });
export const getArticleById = (id)       => api.get(`/articles/${id}`);
export const createArticle  = (data)     => api.post("/articles", data);
export const updateArticle  = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle  = (id)       => api.delete(`/articles/${id}`);

export const getSimilarArticles = (id) => api.get(`/articles/${id}/similar`);

export const uploadImage = (file) => {
    const body = new FormData();
    body.append("image", file);
    return api.post("/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
