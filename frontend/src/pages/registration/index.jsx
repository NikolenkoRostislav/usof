import { useState } from "react";
import { register } from "../../api/auth";
import "./registration.css";

function Registration() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);

        if (password !== passwordConfirmation) {
            setError({ message: "Passwords do not match." });
            return;
        }

        setLoading(true);

        try {
            await register(
                login,
                password,
                passwordConfirmation,
                email,
                fullName
            );

            setRegistered(true);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (registered) {
        return (
            <div className="registration-page">
                <div className="registration-success">
                    <h1>Check your email</h1>

                    <p>
                        We've sent a confirmation link to your email address.
                        Click the link in the email to complete your
                        registration.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-page">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>Registration</h1>

                <div className="registration-field">
                    <label htmlFor="fullName">Full name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={event => setFullName(event.target.value)}
                        required
                    />
                </div>

                <div className="registration-field">
                    <label htmlFor="login">Login</label>
                    <input
                        id="login"
                        type="text"
                        value={login}
                        onChange={event => setLogin(event.target.value)}
                        required
                    />
                </div>

                <div className="registration-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div className="registration-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </div>

                <div className="registration-field">
                    <label htmlFor="passwordConfirmation">
                        Confirm password
                    </label>
                    <input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                    />
                </div>

                {error && (
                    <p className="registration-error">
                        {error.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Registration;
