import { useState } from "react";
import { resetPassword } from "../../api/auth";
import "./request-password-reset.css";

function RequestPasswordReset() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requested, setRequested] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError(null);

        if (password !== passwordConfirmation) {
            setError({ message: "Passwords do not match." });
            return;
        }

        setLoading(true);

        try {
            await resetPassword(email, password);
            setRequested(true);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (requested) {
        return (
            <div className="request-password-reset-page">
                <div className="request-password-reset-success">
                    <h1>Check your email</h1>

                    <p>
                        We've sent a password reset link to your email address.
                        Click the link in the email to complete your password
                        reset.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="request-password-reset-page">
            <form
                className="request-password-reset-form"
                onSubmit={handleSubmit}
            >
                <h1>Reset password</h1>

                <div className="request-password-reset-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div className="request-password-reset-field">
                    <label htmlFor="password">New password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </div>

                <div className="request-password-reset-field">
                    <label htmlFor="passwordConfirmation">
                        Confirm new password
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
                    <p className="request-password-reset-error">
                        {error.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send reset link"}
                </button>
            </form>
        </div>
    );
}

export default RequestPasswordReset;