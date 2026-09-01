const { randomUUID } = require("node:crypto");

class Category {
    constructor({ id = randomUUID(), title, description = null }) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}

module.exports = Category;
