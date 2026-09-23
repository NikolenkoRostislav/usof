import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/auth";
import { getById } from "../../api/users";
import { get as getPosts } from "../../api/posts";
import ProfileData from "./profile-data";
import ProfileEdit from "./profile-edit";
import Post from "../../components/post";
import "./profile.css";

function Profile() {
    const { id } = useParams();
    const { user: currentUser } = useAuth();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                setLoading(true);
                setError(null);

                let profileUser;

                if (currentUser && (!id || currentUser.id === id)) {
                    profileUser = currentUser;
                } else {
                    profileUser = await getById(id);
                }

                setUser(profileUser);

                const response = await getPosts({
                    authorId: profileUser.id,
                });

                setPosts(response.posts);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
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

            <section className="profile-posts">
                <h2>Posts</h2>

                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    <div className="profile-posts-list">
                        {posts.map(post => (
                            <Post
                                key={post.id}
                                post={post}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Profile;