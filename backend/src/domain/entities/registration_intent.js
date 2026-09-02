const { randomUUID } = require("crypto");
const SecureToken = require("../types/secure_token");
const Password = require("../types/password");

class RegistrationIntent {
    constructor({ id = randomUUID(), tokenHash = null, login, passwordHash = null, email, fullName = null, createdAt = new Date() }) {
        this.id = id;
        this.tokenHash = tokenHash;
        this.login = login;
        this.passwordHash = passwordHash;
        this.email = email;
        this.fullName = fullName;
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

module.exports = RegistrationIntent;
