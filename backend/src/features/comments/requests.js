class CreateCommentRequest {
    constructor(content, quoteId = null) {
        this.content = content;
        this.quoteId = quoteId;
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
