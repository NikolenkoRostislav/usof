const { randomUUID } = require("crypto");

class Comment {
    constructor({ id = randomUUID(), authorId = null, postId, quoteId = null, publishDate = new Date(), content, status = "active" }) {
        this.id = id;
        this.authorId = authorId;
        this.postId = postId;
        this.quoteId = quoteId;
        this.publishDate = publishDate;
        this.content = content;
        this.status = status;
    }
}

module.exports = Comment;
