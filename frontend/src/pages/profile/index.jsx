import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById, patchById, deleteById } from "../../api/users";
import Avatar from "../../components/avatar";
import "./profile.css";

function Profile() {
    const { id } = useParams();
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editing, setEditing] = useState(false);
    const [login, setLogin] = useState("");
    const [fullName, setFullName] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                setLoading(true);
                setError(null);

                if (!id && !currentUser) {
                    navigate("/");
                    return;
                }

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
    const isAdmin = currentUser?.role === "admin";
    const canManage = isOwnProfile || isAdmin;

    function startEditing() {
        setLogin(user.login);
        setFullName(user.fullName ?? "");
        setEditing(true);
    }

    function cancelEditing() {
        setEditing(false);
    }

    async function handleSave() {
        try {
            setSaving(true);
            const updatedUser = await patchById(user.id, login, fullName);
            setUser((current) => ({ ...current, ...updatedUser }));
            setEditing(false);
        } catch (error) {
            setError(error);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.login} 's account?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            await deleteById(user.id);

            if (isOwnProfile) {
                await logout();
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(error);
            setDeleting(false);
        }
    }

    return (
        <div className="profile-page">
            <section className="profile-card">
                <div className="profile-avatar">
                    <Avatar user={user} />
                </div>

                <div className="profile-info">
                    {editing ? (
                        <>
                            <div className="profile-field">
                                <label htmlFor="profile-login">
                                    Login
                                </label>

                                <input
                                    id="profile-login"
                                    value={login}
                                    onChange={(event) =>
                                        setLogin(event.target.value)
                                    }
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-full-name">
                                    Full name
                                </label>

                                <input
                                    id="profile-full-name"
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(event.target.value)
                                    }
                                />
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
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
                                        <strong>
                                            {user.email}
                                        </strong>
                                    </div>
                                )}
                            </div>

                            {canManage && (
                                <div className="profile-actions">
                                    <button
                                        type="button"
                                        onClick={startEditing}
                                    >
                                        Edit profile
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-delete"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        {deleting
                                            ? "Deleting..."
                                            : "Delete account"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {error && (
                <p className="profile-error">
                    Something went wrong.
                </p>
            )}
        </div>
    );
}

export default Profile;