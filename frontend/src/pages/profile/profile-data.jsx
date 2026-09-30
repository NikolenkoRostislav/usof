import { useEffect, useState } from "react";
import Avatar from "../../components/avatar";
import { getOwned } from "../../api/awards";

function ProfileData({ user, isOwnProfile }) {
    const [ownedAwards, setOwnedAwards] = useState([]);

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

    return (
        <section className="profile-card">
            {user.role === 'admin' && (
                <div className="profile-admin">
                    ADMIN
                </div>
            )}

            <div className="profile-avatar">
                <Avatar user={user} />
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