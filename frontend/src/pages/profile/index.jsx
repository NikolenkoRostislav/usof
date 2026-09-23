import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById } from "../../api/users";
import Avatar from "../../components/avatar";
import "./profile.css";

function Profile() {
    const { id } = useParams();
    const { user: currentUser } = useAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadUser() {
            try {
                setLoading(true);
                setError(null);

                if (currentUser && (!id || currentUser.id === id)) {
                    setUser(currentUser);
                    return;
                }

                const userData = await getById(id);
                setUser(userData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [id, currentUser]);

    if (loading) {
        return (
            <div className="profile-page">
                <p>Loading...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="profile-page">
                <h1>User not found</h1>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === user.id;

    return (
        <div className="profile-page">
            <section className="profile-card">
                <div className="profile-avatar">
                    <Avatar user={user} />
                </div>

                <div className="profile-info">
                    <h1>{user.login}</h1>

                    <p className="profile-role">
                        {user.role}
                    </p>

                    <div className="profile-details">
                        <div>
                            <span>Full name</span>
                            <strong>
                                {user.fullName || "Not provided"}
                            </strong>
                        </div>

                        <div>
                            <span>Reputation</span>
                            <strong>
                                {user.reputation}
                            </strong>
                        </div>

                        {isOwnProfile && (
                            <div>
                                <span>Email</span>
                                <strong>{user.email}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profile;