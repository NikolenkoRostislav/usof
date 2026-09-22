import Reactions from "./reactions";

function Comment({
    comment,
    comments,
    authors,
    commentLikes,
    onLikesChange,
    expanded,
    toggleReplies,
    user,
    reply = false
}) {
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
                                    comment={child}
                                    comments={comments}
                                    authors={authors}
                                    commentLikes={commentLikes}
                                    onLikesChange={onLikesChange}
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