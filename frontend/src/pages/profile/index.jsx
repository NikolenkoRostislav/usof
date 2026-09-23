import { useEffect, useRef, useState } from "react";
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
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState(null);

    const loadMoreRef = useRef(null);
    const loadingRef = useRef(false);

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
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [id, currentUser]);

    async function loadPosts() {
        if (loadingRef.current || !hasMore || !user) {
            return;
        }

        loadingRef.current = true;
        setLoadingPosts(true);
        setError(null);

        try {
            const response = await getPosts({
                authorId: user.id,
                page,
            });

            if (response.posts.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts(prev => [...prev, ...response.posts]);
            setPage(prev => prev + 1);
        } catch (error) {
            setError(error);
        } finally {
            loadingRef.current = false;
            setLoadingPosts(false);
        }
    }

    useEffect(() => {
        if (user) {
            loadPosts();
        }
    }, [user]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadPosts();
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    });

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

                {posts.length === 0 && !loadingPosts ? (
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

                <div
                    ref={loadMoreRef}
                    className="profile-load-more"
                >
                    {loadingPosts && <p>Loading...</p>}
                    {!hasMore && posts.length > 0 && (
                        <p>No more posts.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Profile;