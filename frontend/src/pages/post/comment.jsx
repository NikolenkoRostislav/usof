import { useState } from "react";
import Reactions from "./reactions";
import CreateComment from "./create-comment";

function Comment({
    postId,
    comment,
    comments,
    authors,
    commentLikes,
    onLikesChange,
    onCommentCreated,
    expanded,
    toggleReplies,
    user,
    reply = false
}) {
    const [answering, setAnswering] = useState(false);

    const replies = comments.filter(
        (child) => child.quoteId === comment.id
    );

    const author = authors[comment.authorId];
    const isExpanded = expanded.has(comment.id);

    return (
        <article className={`comment ${reply ? "comment-reply" : ""}`}>
            <div className="comment-header">
                <strong>
                    {author?.login ?? "Unknown author"}
                </strong>

                <span>
                    {new Date(comment.publishDate).toLocaleDateString()}
                </span>

                <button
                    type="button"
                    className="comment-answer"
                    onClick={() => setAnswering((current) => !current)}
                >
                    {answering ? "Cancel" : "Answer"}
                </button>
            </div>

            <div className="comment-content">
                {comment.content}
            </div>

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
                        {isExpanded ? "Hide replies"
                            : `Show ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
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