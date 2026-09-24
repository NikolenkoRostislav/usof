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
    }

    function handleLikesChange(commentId, updatedLikes) {
        setLikes((current) => ({
            ...current,
            [commentId]: updatedLikes
        }));
    }

    if (loading) {
        return (
            <section className="comments">
                Loading comments...
            </section>
        );
    }

    const topLevelComments = comments.filter((comment) => comment.quoteId === null);

    return (
        <section className="comments">
            <h2>Comments</h2>

            {post.status === 'active' && user && (<CreateComment
                postId={post.id}
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
                            key={comment.id}
                            comment={comment}
                            comments={comments}
                            authors={authors}
                            commentLikes={likes}
                            onLikesChange={handleLikesChange}
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