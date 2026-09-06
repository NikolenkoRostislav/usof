class LikeResponse {
    constructor(like) {
        this.id = like.id;
        this.authorId = like.authorId;
        this.publishDate = like.publishDate;
        this.type = like.type;
        this.postId = like.postId;
        this.commentId = like.commentId;
    }
}

class LikesListResponse {
    constructor(likes) {
        this.likes = likes.map(l => new LikeResponse(l));
    }
}

module.exports = {
    LikeResponse,
    LikesListResponse,
};
