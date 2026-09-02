const bcrypt = require("bcrypt");

const saltRounds = 10;

class Password {
    static async hash(password) {
        return bcrypt.hash(password, saltRounds);
    }

    static async checkPassword(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
}

module.exports = Password;
