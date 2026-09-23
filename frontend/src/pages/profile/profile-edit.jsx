import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import { patchById, deleteById } from "../../api/users";

function ProfileEdit({ user, onUserChange, isOwnProfile }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [login, setLogin] = useState(user.login);
    const [fullName, setFullName] = useState(user.fullName ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    function startEditing() {
        setLogin(user.login);
        setFullName(user.fullName ?? "");
        setError(null);
        setEditing(true);
    }

    function cancelEditing() {
        setEditing(false);
        setError(null);
    }

    async function handleSave() {
        try {
            setSaving(true);
            setError(null);

            await patchById(user.id, login, fullName);

            onUserChange({
                ...user,
                login,
                fullName
            });

            setEditing(false);
        } catch (error) {
            setError(error);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm(
            `Are you sure you want to delete ${user.login} 's account?`
        )) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteById(user.id);

            if (isOwnProfile) {
                await logout();
            }

            navigate("/");
        } catch (error) {
            setError(error);
            setDeleting(false);
        }
    }

    if (editing) {
        return (
            <section className="profile-edit">
                <h2>Edit profile</h2>

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

                {error && (
                    <p className="profile-error">
                        Something went wrong.
                    </p>
                )}
            </section>
        );
    }

    return (
        <section className="profile-actions">
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
                {deleting ? "Deleting..." : "Delete account"}
            </button>

            {error && (
                <p className="profile-error">
                    Something went wrong.
                </p>
            )}
        </section>
    );
}

export default ProfileEdit;
