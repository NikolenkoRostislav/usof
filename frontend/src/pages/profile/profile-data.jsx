import { useEffect, useRef, useState } from "react";
import Avatar from "../../components/avatar";
import { getOwned } from "../../api/awards";
import { updateAvatar } from "../../api/users";

function ProfileData({ user, isOwnProfile }) {
    const [ownedAwards, setOwnedAwards] = useState([]);
    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (!isOwnProfile) {
            return;
        }

        async function loadOwnedAwards() {
            try {
                const data = await getOwned();
                setOwnedAwards(data.awards);
            } catch (error) {
                console.error("Failed to load owned awards:", error);
            }
        }

        loadOwnedAwards();
    }, [isOwnProfile]);

    function handleAvatarClick() {
        if (!isOwnProfile) {
            return;
        }

        avatarInputRef.current?.click();
    }

    async function handleAvatarChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.type !== "image/png") {
            alert("Please select a PNG image.");
            event.target.value = "";
            return;
        }

        try {
            await updateAvatar(user.id, file);
            window.location.reload();
        } catch (error) {
            console.error("Failed to update avatar:", error);
        }

        event.target.value = "";
    }

    return (
        <section className="profile-card">
            {user.role === "admin" && (
                <div className="profile-admin">
                    ADMIN
                </div>
            )}

            <div
                className={`profile-avatar ${isOwnProfile ? "profile-avatar-editable" : ""}`}
                onClick={handleAvatarClick}
            >
                <Avatar user={user} />

                {isOwnProfile && (
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png"
                        onChange={handleAvatarChange}
                        hidden
                    />
                )}
            </div>

            <div className="profile-info">
                <h1>{user.login}</h1>

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

                {isOwnProfile && ownedAwards.length > 0 && (
                    <div className="profile-awards">
                        <span>Awards</span>

                        <div className="profile-awards-list">
                            {ownedAwards.map((owned) => (
                                <div
                                    key={owned.awardId}
                                    className={`profile-award-${owned.award?.rarity ?? "common"}`}
                                    title={owned.award?.description}
                                >
                                    <strong>
                                        {owned.award?.title}
                                    </strong>

                                    <span>
                                        {" | "}
                                        {owned.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProfileData;