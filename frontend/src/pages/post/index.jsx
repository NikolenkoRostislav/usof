import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "../../context/auth";
import { getById as getPostById } from "../../api/posts";
import { getById as getUserById } from "../../api/users";
import { getByPostId as getLikesByPostId } from "../../api/likes";
import { getByPostId as getAwardsByPostId, getAwards as getAllAwards } from "../../api/awards";
import { checkByPostId, deleteByPostId, postByPostId } from "../../api/favorites";
import Reactions from "./reactions";
import Comments from "./comments";
import Awards from "./awards";
import Avatar from "../../components/avatar";
import "./post.css";

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [likes, setLikes] = useState([]);
    const [awards, setAwards] = useState([]);
    const [allAwardsData, setAllAwardsData] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                setError(null);

                const postData = await getPostById(id);

                const [
                    likesData,
                    awardsData,
                    allAwardsData,
                    favoriteData,
                ] = await Promise.all([
                    getLikesByPostId(id),
                    getAwardsByPostId(id),
                    getAllAwards(),
                    user
                        ? checkByPostId(id)
                        : Promise.resolve({ isFavorited: false }),
                ]);

                setPost(postData);
                setLikes(likesData.likes);
                setAwards(awardsData.awards);
                setAllAwardsData(allAwardsData.awards);
                setIsFavorited(favoriteData.isFavorited);

                try {
                    const authorData = await getUserById(postData.authorId);
                    setAuthor(authorData);
                } catch (error) {
                    console.error("Failed to load post author:", error);
                    setAuthor(null);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [id, user]);

    async function reloadAwards() {
        const awardsData = await getAwardsByPostId(id);
        setAwards(awardsData.awards);
    }

    async function toggleFavorite() {
        if (!user || favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            if (isFavorited) {
                await deleteByPostId(id);
                setIsFavorited(false);
            } else {
                await postByPostId(id);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error("Failed to update favorite:", error);
        } finally {
            setFavoriteLoading(false);
        }
    }

    if (loading) {
        return <div className="post-page">Loading...</div>;
    }

    if (error || !post) {
        return (
            <div className="post-page">
                <h1>Post not found</h1>
            </div>
        );
    }

    const canEdit = user?.role === "admin" || (user?.id === post.authorId && post.status === "active");

    return (
        <div className="post-page">
            <section className="post-main">
                <header className="post-header">
                    <h1>{post.title}</h1>

                    <div className="post-meta">
                        {author ? (
                            <div className="post-author">
                                <Link
                                    to={`/profile/${author.id}`}
                                    className="post-author-avatar"
                                >
                                    <Avatar user={author} />
                                </Link>

                                <Link to={`/profile/${author.id}`}>
                                    {author.login}
                                </Link>
                            </div>
                        ) : (
                            <span>Unknown author</span>
                        )}

                        <span className="post-date">
                            {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="post-categories">
                        {post.categories.map(category => (
                            <span
                                key={category.id}
                                className="post-category"
                            >
                                {category.title}
                            </span>
                        ))}
                    </div>

                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => navigate(`/posts/edit/${id} `)}
                        >
                            Edit
                        </button>
                    )}

                    {user && (
                        <button
                            type="button"
                            onClick={toggleFavorite}
                            disabled={favoriteLoading}
                            aria-pressed={isFavorited}
                        >
                            {favoriteLoading ? "Updating..."
                                : isFavorited ? "unfavorite" : "favorite"}
                        </button>
                    )}

                    <Awards
                        postId={post.id}
                        awards={awards}
                        allAwardsData={allAwardsData}
                        onAwardGiven={reloadAwards}
                    />
                </header>

                <div className="post-content">
                    {post.content}
                </div>

                <div className="post-footer">
                    <Reactions
                        postId={id}
                        user={user}
                        likes={likes}
                        onLikesChange={setLikes}
                    />
                </div>
            </section>

            <section className="post-comments">
                <Comments post={post} />
            </section>
        </div>
    );
}

export default Post;