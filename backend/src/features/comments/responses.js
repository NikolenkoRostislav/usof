class CommentResponse {
    constructor(comment) {
        this.id = comment.id;
        this.authorId = comment.authorId;
        this.postId = comment.postId;
        this.publishDate = comment.publishDate;
        this.content = comment.content;
        this.status = comment.status;
    }
}

class CommentsListResponse {
    constructor(comments) {
        this.comments = comments.map(c => new CommentResponse(c));
    }
}

module.exports = {
    CommentResponse,
    CommentsListResponse,
};
