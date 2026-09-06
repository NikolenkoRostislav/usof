class CreateCommentRequest {
    constructor(content) {
        this.content = content;
    }
}

class UpdateCommentRequest {
    constructor(content, status) {
        this.content = content;
        this.status = status;
    }
}

module.exports = {
    CreateCommentRequest,
    UpdateCommentRequest,
};
