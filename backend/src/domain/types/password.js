const { AppError, Kind } = require("../errors")
const bcrypt = require("bcrypt");

const saltRounds = 10;

class Password {
    static async hash(password) {
        return bcrypt.hash(password, saltRounds);
    }

    static async checkPassword(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }

    static validateComplexity(password) {
        if (password.length < 8) {
            throw new AppError(Kind.InvalidEntry, 'Password must be at least 8 characters long');
        }
        if (!/[a-z]/.test(password)) {
            throw new AppError(Kind.InvalidEntry, 'Password must contain a lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            throw new AppError(Kind.InvalidEntry, 'Password must contain an uppercase letter');
        }
        if (!/\d/.test(password)) {
            throw new AppError(Kind.InvalidEntry, 'Password must contain a digit');
        }
    }
}

module.exports = Password;
