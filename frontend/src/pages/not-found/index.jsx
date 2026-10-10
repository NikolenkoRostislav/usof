import { Link } from "react-router";
import "./not-found.css";

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-panel marble-panel panel-frame panel-ornament">
                <p className="not-found-code">404</p>
                <h1>Page not found</h1>
                <p className="not-found-message">
                    The page you are looking for has been moved or does not exist.
                </p>
                <Link to="/" className="button-gold not-found-link">
                    Back to home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
