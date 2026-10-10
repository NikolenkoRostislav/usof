import { useState } from "react";
import { useAuth } from "../../context/auth";
import { Link, useNavigate } from "react-router";
import "./login.css";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [userLogin, setUserLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            await login(userLogin, password);
            navigate("/");
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Login</h1>

                <div className="login-field">
                    <label htmlFor="login">Login</label>
                    <input
                        id="login"
                        type="text"
                        value={userLogin}
                        onChange={event => setUserLogin(event.target.value)}
                        required
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p className="error-message">
                        Login failed.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="login-link">
                    <Link to="/request-password-reset">Forgot your password?</Link>
                </p>

                <p className="login-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;