import { Link } from "react-router-dom";

const NotFound = () => (
    <div className="not-found anim-fade-up">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page introuvable</h1>
        <p className="not-found__sub">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn btn--primary btn--lg">← Retour à l'accueil</Link>
    </div>
);

export default NotFound;
