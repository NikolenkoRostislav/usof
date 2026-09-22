import {
    getByPostId as getLikesByPostId,
    postByPostId,
    deleteByPostId as deleteLikeByPostId
} from "../../api/likes";
import { useState } from "react";
import "./reactions.css";

function Reactions({ postId, user, likes, onLikesChange }) {
    const [loading, setLoading] = useState(false);

    const userReaction = user
        ? likes.find((like) => like.authorId === user.id)?.type
        : null;

    const likesCount = likes.filter(
        (like) => like.type === "like"
    ).length;

    const dislikesCount = likes.filter(
        (like) => like.type === "dislike"
    ).length;

    const score = likesCount - dislikesCount;

    async function handleReaction(type) {
        if (!user || loading) {
            return;
        }

        const currentReaction = likes.find(
            (like) => like.authorId === user.id
        );

        try {
            setLoading(true);

            if (currentReaction?.type === type) {
                await deleteLikeByPostId(postId);
            } else {
                await postByPostId(postId, type);
            }

            const updatedLikes = await getLikesByPostId(postId);
            onLikesChange(updatedLikes.likes);
        } catch (error) {
            console.error("Failed to update reaction:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="post-reactions">
            <button
                type="button"
                className={`post-reaction ${userReaction === "like"
                        ? "post-reaction-active"
                        : ""
                    } ${!user ? "post-reaction-disabled" : ""}`}
                title={user ? `${likesCount} likes` : "Log in to react"}
                onClick={() => handleReaction("like")}
                disabled={!user || loading}
            >
                👍
            </button>

            <span className="post-score">
                {score}
            </span>

            <button
                type="button"
                className={`post-reaction ${userReaction === "dislike"
                        ? "post-reaction-active"
                        : ""
                    } ${!user ? "post-reaction-disabled" : ""}`}
                title={user ? `${dislikesCount} dislikes` : "Log in to react"}
                onClick={() => handleReaction("dislike")}
                disabled={!user || loading}
            >
                👎
            </button>
        </div>
    );
}

export default Reactions;