const { randomUUID } = require("crypto");

class Post {
    constructor({ id = randomUUID(), authorId = null, title, publishDate = new Date(), status = "active", content, categories = [] }) {
        this.id = id;
        this.authorId = authorId;
        this.title = title;
        this.publishDate = publishDate;
        this.status = status;
        this.content = content;
        this.categories = categories;
    }
}

module.exports = Post;