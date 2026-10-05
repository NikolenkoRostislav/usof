import { useEffect, useState } from "react";
import { getByPostId } from "../../api/comments";
import { getById as getUserById } from "../../api/users";
import { getByCommentId as getLikesByCommentId } from "../../api/likes";
import { useAuth } from "../../context/auth";
import CreateComment from "./create-comment";
import Comment from "./comment";
import "./comments.css";

function Comments({ post }) {
    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [authors, setAuthors] = useState({});
    const [likes, setLikes] = useState({});
    const [expanded, setExpanded] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [commentOrder, setCommentOrder] = useState([]);

    useEffect(() => {
        async function loadComments() {
            try {
                const commentsData = await getByPostId(post.id);
                const loadedComments = commentsData.comments;

                setComments(loadedComments);

                const authorIds = [
                    ...new Set(
                        loadedComments.map(
                            (comment) => comment.authorId
                        )
                    )
                ];

                const authorEntries = await Promise.all(
                    authorIds.map(async (authorId) => {
                        const author = await getUserById(authorId);
                        return [authorId, author];
                    })
                );

                const likeEntries = await Promise.all(
                    loadedComments.map(async (comment) => {
                        const data = await getLikesByCommentId(comment.id);
                        return [comment.id, data.likes];
                    })
                );
                setAuthors(Object.fromEntries(authorEntries));
                setLikes(Object.fromEntries(likeEntries));

                const likesByComment = Object.fromEntries(likeEntries);

                const sortedComments = [...loadedComments]
                    .filter((comment) => comment.quoteId === null)
                    .sort((a, b) => {
                        const aLikes = likesByComment[a.id] ?? [];
                        const bLikes = likesByComment[b.id] ?? [];

                        const aScore =
                            aLikes.filter((like) => like.type === "like").length -
                            aLikes.filter((like) => like.type === "dislike").length;

                        const bScore =
                            bLikes.filter((like) => like.type === "like").length -
                            bLikes.filter((like) => like.type === "dislike").length;

                        return bScore - aScore;
                    });

                setCommentOrder(sortedComments.map((comment) => comment.id));
            } catch (error) {
                console.error("Failed to load comments:", error);
            } finally {
                setLoading(false);
            }
        }

        loadComments();
    }, [post.id]);

    function toggleReplies(commentId) {
        setExpanded((current) => {
            const next = new Set(current);

            if (next.has(commentId)) {
                next.delete(commentId);
            } else {
                next.add(commentId);
            }

            return next;
        });
    }

    function handleCommentCreated(comment) {
        setComments((current) => [...current, comment]);

        setAuthors((current) => ({
            ...current,
            [comment.authorId]: user
        }));

        setLikes((current) => ({
            ...current,
            [comment.id]: []
        }));

        if (comment.quoteId === null) {
            setCommentOrder((current) => [...current, comment.id]);
        }
    }

    function handleLikesChange(commentId, updatedLikes) {
        setLikes((current) => ({
            ...current,
            [commentId]: updatedLikes
        }));
    }

    function handleCommentDeleted(commentId) {
        setComments((current) =>
            current.filter((comment) => comment.id !== commentId)
        );

        setLikes((current) => {
            const next = { ...current };
            delete next[commentId];
            return next;
        });

        setExpanded((current) => {
            const next = new Set(current);
            next.delete(commentId);
            return next;
        });
    }

    if (loading) {
        return (
            <section className="comments">
                Loading comments...
            </section>
        );
    }

    const topLevelComments = commentOrder
        .map((id) => comments.find((comment) => comment.id === id))
        .filter((comment) => comment !== undefined)

    return (
        <section className="comments">
            <h2>Comments</h2>

            {post.status === 'active' && user && (<CreateComment
                postId={post.id}
                quoteId={null}
                onCreated={handleCommentCreated}
            />)}

            {topLevelComments.length === 0 ? (
                <p className="comments-empty">
                    No comments yet.
                </p>
            ) : (
                <div className="comments-list">
                    {topLevelComments.map((comment) => (
                        <Comment
                            postId={post.id}
                            key={comment.id}
                            comment={comment}
                            comments={comments}
                            authors={authors}
                            commentLikes={likes}
                            onCommentDeleted={handleCommentDeleted}
                            onLikesChange={handleLikesChange}
                            onCommentCreated={handleCommentCreated}
                            expanded={expanded}
                            toggleReplies={toggleReplies}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default Comments;