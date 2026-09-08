const { randomUUID } = require("crypto");

class Award {
    constructor({ id = randomUUID(), title, description = null, rarity }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rarity = rarity;
    }
}

module.exports = Award;
