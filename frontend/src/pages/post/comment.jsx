import { useState } from "react";
import { Link } from "react-router";
import Reactions from "./reactions";
import CreateComment from "./create-comment";
import { deleteById, patchById } from "../../api/comments";

function Comment({
    postId,
    comment,
    comments,
    authors,
    commentLikes,
    onLikesChange,
    onCommentCreated,
    onCommentDeleted,
    expanded,
    toggleReplies,
    user,
    reply = false
}) {
    const [answering, setAnswering] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [editStatus, setEditStatus] = useState(comment.status);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    const replies = comments.filter(
        (child) => child.quoteId === comment.id
    );

    const author = authors[comment.authorId];
    const isExpanded = expanded.has(comment.id);

    const isAuthor = user?.id === comment.authorId;
    const isAdmin = user?.role === "admin";

    const canDelete = isAuthor || isAdmin;
    const canEdit = isAuthor || isAdmin;

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            await deleteById(comment.id);
            onCommentDeleted?.(comment.id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    }

    function handleEditStart() {
        setEditContent(comment.content);
        setEditStatus(comment.status);
        setEditError(null);
        setEditing(true);
    }

    function handleEditCancel() {
        setEditContent(comment.content);
        setEditStatus(comment.status);
        setEditError(null);
        setEditing(false);
    }

    async function handleEditSubmit(event) {
        event.preventDefault();

        const data = {};

        if (isAuthor) {
            data.content = editContent;
        }

        if (isAdmin) {
            data.status = editStatus;
        }

        try {
            setEditLoading(true);
            setEditError(null);

            await patchById(comment.id, data);

            comment.content = isAuthor ? editContent : comment.content;
            comment.status = isAdmin ? editStatus : comment.status;

            setEditing(false);
        } catch (error) {
            setEditError("Failed to update comment.");
        } finally {
            setEditLoading(false);
        }
    }

    return (
        <article className={`comment ${reply ? "comment-reply" : ""}`}>
            <div className="comment-header">
                <strong>
                    {author ? (
                        <Link to={`/profile/${author.id}`}>
                            {author.login}
                        </Link>
                    ) : (
                        "Unknown author"
                    )}
                </strong>

                <span>
                    {new Date(comment.publishDate).toLocaleDateString()}
                </span>

                {canEdit && (
                    <button
                        type="button"
                        className="comment-edit"
                        onClick={editing ? handleEditCancel : handleEditStart}
                    >
                        {editing ? "Cancel" : "Edit"}
                    </button>
                )}

                {canDelete && (
                    <button
                        type="button"
                        className="comment-delete"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}

                <button
                    type="button"
                    className="comment-answer"
                    onClick={() => setAnswering((current) => !current)}
                >
                    {answering ? "Cancel" : "Answer"}
                </button>
            </div>

            {editing ? (
                <form
                    className="comment-edit-form"
                    onSubmit={handleEditSubmit}
                >
                    {isAuthor && (
                        <textarea
                            value={editContent}
                            onChange={(event) =>
                                setEditContent(event.target.value)
                            }
                            disabled={editLoading}
                            required
                        />
                    )}

                    {isAdmin && (
                        <select
                            value={editStatus}
                            onChange={(event) =>
                                setEditStatus(event.target.value)
                            }
                            disabled={editLoading}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    )}

                    {editError && (
                        <div className="comment-edit-error">
                            {editError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={
                            editLoading ||
                            (isAuthor && !editContent.trim())
                        }
                    >
                        {editLoading ? "Saving..." : "Save"}
                    </button>
                </form>
            ) : (
                <div className="comment-content">
                    {comment.content}
                </div>
            )}

            <Reactions
                commentId={comment.id}
                user={user}
                likes={commentLikes[comment.id] ?? []}
                onLikesChange={(updatedLikes) =>
                    onLikesChange(comment.id, updatedLikes)
                }
            />

            {answering && (
                <CreateComment
                    postId={postId}
                    quoteId={comment.id}
                    onCreated={(newComment) => {
                        onCommentCreated(newComment);
                        setAnswering(false);
                    }}
                />
            )}

            {replies.length > 0 && (
                <>
                    <button
                        type="button"
                        className="comment-replies-toggle"
                        onClick={() => toggleReplies(comment.id)}
                    >
                        {isExpanded
                            ? "Hide replies"
                            : `Show ${replies.length} ${replies.length === 1
                                ? "reply"
                                : "replies"
                            }`}
                    </button>

                    {isExpanded && (
                        <div className="comment-replies">
                            {replies.map((child) => (
                                <Comment
                                    key={child.id}
                                    postId={postId}
                                    comment={child}
                                    comments={comments}
                                    authors={authors}
                                    commentLikes={commentLikes}
                                    onLikesChange={onLikesChange}
                                    onCommentCreated={onCommentCreated}
                                    onCommentDeleted={onCommentDeleted}
                                    expanded={expanded}
                                    toggleReplies={toggleReplies}
                                    user={user}
                                    reply
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </article>
    );
}

export default Comment;