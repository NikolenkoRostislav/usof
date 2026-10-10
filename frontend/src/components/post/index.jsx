import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/auth";
import { deleteById } from "../../api/posts";
import { getByPostId as getLikesByPostId } from "../../api/likes";
import Avatar from "../avatar";
import "./post.css";

function Post({ post, author, onDelete }) {
    const { user: currentUser } = useAuth();
    const [score, setScore] = useState(null);

    const isOwnPost = currentUser?.id === post.authorId;
    const canDelete = isOwnPost || currentUser?.role === "admin";

    useEffect(() => {
        let cancelled = false;

        async function loadScore() {
            try {
                const response = await getLikesByPostId(post.id);

                if (cancelled) {
                    return;
                }

                const likesCount = response.likes.filter(
                    like => like.type === "like"
                ).length;

                const dislikesCount = response.likes.filter(
                    like => like.type === "dislike"
                ).length;

                setScore(likesCount - dislikesCount);
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load post score:", error);
                }
            }
        }

        loadScore();

        return () => {
            cancelled = true;
        };
    }, [post.id]);

    async function handleDelete(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await deleteById(post.id);

            if (onDelete) {
                onDelete(post.id);
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    }

    return (
        <article className="post-card">
            <Link to={`/posts/${post.id}`} className="post-card-link">
                <div className="post-card-author">
                    {author ? (
                        <>
                            <Avatar user={author} />

                            <span className="post-card-author-name">
                                {author.login}
                            </span>
                        </>
                    ) : (
                        <span className="post-card-author-name">
                            Unknown author
                        </span>
                    )}
                </div>

                <div className="post-card-details">
                    <div className="post-card-title-row">
                        <h2 className="post-card-title">{post.title}</h2>

                        {post.status !== "active" && (
                            <span className="post-card-status">
                                {post.status}
                            </span>
                        )}
                    </div>

                    <p className="post-card-content">
                        {post.content}
                    </p>

                    <div className="post-card-footer">
                        <span>
                            {new Date(post.publishDate).toLocaleDateString()}
                        </span>

                        <span className="post-card-score">
                            Score: {score ?? "—"}
                        </span>

                        {canDelete && (
                            <button
                                type="button"
                                className="post-card-delete"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default Post;