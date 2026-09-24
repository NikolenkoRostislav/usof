import { useState } from "react";
import { post as createComment } from "../../api/comments";
import "./create-comment.css";

function CreateComment({ postId, quoteId, onCreated }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const comment = await createComment(postId, content.trim(), quoteId);

            setContent("");
            onCreated?.(comment);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="create-comment" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={quoteId ? "Write an answer..." : "Write a comment..."}
                disabled={loading}
            />

            {error && (
                <div className="create-comment-error">
                    Failed to create comment.
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !content.trim()}
            >
                {loading ? "Posting..." : "Comment"}
            </button>
        </form>
    );
}

export default CreateComment;