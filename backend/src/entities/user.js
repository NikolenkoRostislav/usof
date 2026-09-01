const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");

const saltRounds = 10;

class User {
    constructor({ id = randomUUID(), login, passwordHash, fullName, email, pfpKey = null, role = "user", rating = 0 }) {
        this.id = id;
        this.login = login;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.email = email;
        this.pfpKey = pfpKey;
        this.role = role;
        this.rating = rating;
    }

    async setPassword(password) {
        this.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    async checkPassword(password) {
        return bcrypt.compare(password, this.passwordHash);
    }
}


module.exports = User;