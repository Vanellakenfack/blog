import { useRef, useState } from "react";
import { uploadImage } from "../api/article.api";

const UploadIcon = () => (
    <svg className="img-drop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5" strokeLinecap="round"/>
        <path d="M12 4v12m0-12l-3.5 3.5M12 4l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ImageUploader = ({ value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError]         = useState(null);
    const [drag, setDrag]           = useState(false);
    const inputRef                  = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const res = await uploadImage(file);
            onChange(res.data.url);
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => handleFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="img-uploader">
            <div
                className={`img-drop ${drag ? "img-drop--drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                    onChange={handleChange}
                    disabled={uploading}
                />

                {value ? (
                    <img src={value} alt="Aperçu" className="img-drop__preview" />
                ) : (
                    <div className="img-drop__placeholder">
                        <UploadIcon />
                        <p className="img-drop__label">
                            <strong>Cliquer</strong> ou déposer une image ici
                        </p>
                        <span className="img-drop__hint">JPG, PNG, WebP — max 5 Mo</span>
                    </div>
                )}

                {uploading && (
                    <div className="img-drop__uploading">
                        <span className="spinner" />
                        Envoi en cours…
                    </div>
                )}
            </div>

            {error && <p className="form-error">{error}</p>}

            {value && (
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        type="text"
                        className="form-input"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="URL de l'image"
                        style={{ flex: 1, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="btn btn--danger"
                        style={{ flexShrink: 0 }}
                    >
                        Supprimer
                    </button>
                </div>
            )}

            <div className="img-uploader__or">ou</div>

            <input
                type="url"
                className="form-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Coller une URL d'image…"
            />
        </div>
    );
};

export default ImageUploader;
