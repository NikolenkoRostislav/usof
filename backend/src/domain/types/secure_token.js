const crypto = require("crypto");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const tokenLength = 32;

class SecureToken {
    static generate() {
        return crypto.randomBytes(tokenLength).toString("base64url");
    }

    static async hash(token) {
        return bcrypt.hash(token, saltRounds);
    }

    static async verify(token, tokenHash) {
        return bcrypt.compare(token, tokenHash);
    }
}

module.exports = SecureToken;
