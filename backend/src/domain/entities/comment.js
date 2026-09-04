const { randomUUID } = require("crypto");

class Comment {
    constructor({ id = randomUUID(), authorId = null, postId, publishDate = new Date(), content, status = "active" }) {
        this.id = id;
        this.authorId = authorId;
        this.postId = postId;
        this.publishDate = publishDate;
        this.content = content;
        this.status = status;
    }
}

module.exports = Comment;
