const { randomUUID } = require("crypto");
const SecureToken = require("../types/secure_token");
const Password = require("../types/password");

class PasswordUpdateIntent {
    constructor({ id = randomUUID(), tokenHash = null, email, passwordHash = null, isUsed = false, createdAt = new Date() }) {
        this.id = id;
        this.tokenHash = tokenHash;
        this.email = email;
        this.passwordHash = passwordHash;
        this.isUsed = isUsed;
        this.createdAt = createdAt;
    }

    async setPassword(password) {
        this.passwordHash = await Password.hash(password);
    }

    async generateToken() {
        this.token = SecureToken.generate();
        this.tokenHash = await SecureToken.hash(this.token);
        return this.token;
    }

    async verify(token) {
        return SecureToken.verify(token, this.tokenHash);
    }
}

module.exports = PasswordUpdateIntent;
