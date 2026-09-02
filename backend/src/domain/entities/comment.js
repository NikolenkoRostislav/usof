const { randomUUID } = require("crypto");

class Comment {
    constructor({ id = randomUUID(), authorId = null, postId, publishDate = new Date(), content }) {
        this.id = id;
        this.authorId = authorId;
        this.postId = postId;
        this.publishDate = publishDate;
        this.content = content;
    }
}

module.exports = Comment;
