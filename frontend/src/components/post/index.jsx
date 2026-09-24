import { Link } from "react-router";
import "./post.css";

function Post({ post }) {
    return (
        <article className="post-card">
            <Link to={`/posts/${post.id}`} className="post-card-link">
                <div className="post-card-header">
                    <h2 className="post-card-title">{post.title}</h2>

                    {post.status !== "active" && (<span className={`post-card-status`}>
                        {post.status}
                    </span>)}
                </div>

                <p className="post-card-content">
                    {post.content}
                </p>

                <div className="post-card-footer">
                    <span>
                        {new Date(post.publishDate).toLocaleDateString()}
                    </span>

                    {post.categories?.length > 0 && (
                        <div className="post-card-categories">
                            {post.categories.map(category => (
                                <span key={category} className="post-card-category">
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}

export default Post;