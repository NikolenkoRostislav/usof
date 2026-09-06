class CreatePostLikeRequest {
    constructor(type) {
        this.type = type;
    }
}

class CreateCommentLikeRequest {
    constructor(type) {
        this.type = type;
    }
}

module.exports = {
    CreatePostLikeRequest,
    CreateCommentLikeRequest,
};
