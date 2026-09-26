import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { confirmRegistration } from "../../api/auth";
import "./confirm-registration.css";

function ConfirmRegistration() {
    const { token, email } = useParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function confirm() {
            try {
                await confirmRegistration(email, token);
                window.location.href = "/";
            } catch (error) {
                setError(error);
            }
        }

        confirm();
    }, [email, token]);

    if (error) {
        return (
            <div className="confirm-registration-page">
                <div className="confirm-registration-message">
                    <h1>Registration failed</h1>
                    <p>{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="confirm-registration-page">
            <div className="confirm-registration-message">
                <h1>Confirming registration...</h1>
            </div>
        </div>
    );
}

export default ConfirmRegistration;