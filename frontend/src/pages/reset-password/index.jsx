import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { confirmPasswordReset } from "../../api/auth";
import { useAuth } from "../../context/auth";
import "./reset-password.css";

function ResetPassword() {
    const { token, email } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [error, setError] = useState(null);

    useEffect(() => {
        async function confirm() {
            try {
                await confirmPasswordReset(email, token);
                await logout();
                navigate("/login");
            } catch (error) {
                setError(error);
            }
        }

        confirm();
    }, [email, token, logout, navigate]);

    if (error) {
        return (
            <div className="reset-password-page">
                <div className="reset-password-message">
                    <h1>Password reset failed</h1>
                    <p>{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-message">
                <h1>Resetting password...</h1>
            </div>
        </div>
    );
}

export default ResetPassword;