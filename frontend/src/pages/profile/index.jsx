import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById } from "../../api/users";
import ProfileData from "./profile-data";
import ProfileEdit from "./profile-edit";
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

                setUser(await getById(id));
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
    const canManage = isOwnProfile || currentUser?.role === "admin";

    return (
        <div className="profile-page">
            <ProfileData
                user={user}
                isOwnProfile={isOwnProfile}
            />

            {canManage && (
                <ProfileEdit
                    user={user}
                    onUserChange={setUser}
                    isOwnProfile={isOwnProfile}
                />
            )}
        </div>
    );
}

export default Profile;
