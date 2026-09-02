const { randomUUID } = require("crypto");

class Like {
    constructor({ id = randomUUID(), authorId = null, publishDate = new Date(), type, postId = null, commentId = null }) {
        this.id = id;
        this.authorId = authorId;
        this.publishDate = publishDate;
        this.type = type;
        this.postId = postId;
        this.commentId = commentId;
    }
}

module.exports = Like;
