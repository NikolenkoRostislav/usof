import { Link } from "react-router";
import { useAuth } from "../../context/auth";
import { deleteById } from "../../api/posts";
import "./post.css";

function Post({ post, onDelete }) {
    const { user: currentUser } = useAuth();

    const isOwnPost = currentUser?.id === post.authorId;
    const canDelete = isOwnPost || currentUser?.role === "admin";

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
                <div className="post-card-header">
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
            </Link>
        </article>
    );
}

export default Post;