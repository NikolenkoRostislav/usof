const { randomUUID } = require("crypto");
const Password = require("../types/password");

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
        this.passwordHash = await Password.hash(password);
    }

    async checkPassword(password) {
        return Password.checkPassword(password, this.passwordHash);
    }
}


module.exports = User;