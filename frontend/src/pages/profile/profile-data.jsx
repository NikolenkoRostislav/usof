import Avatar from "../../components/avatar";

function ProfileData({ user, isOwnProfile }) {
    return (
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
    );
}

export default ProfileData;
