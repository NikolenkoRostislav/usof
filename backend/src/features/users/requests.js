const { AppError, Kind } = require("../../domain/errors");
const Password = require("../../domain/types/password");

class CreateUserRequest {
    constructor(login, email, password, fullName, role) {
        if (!email.includes('@')) {
            throw new AppError(Kind.InvalidEntry, 'Invalid email');
        }
        Password.validateComplexity(password);

        this.login = login;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }
}

class UpdateUserRequest {
    constructor(updates) {
        Object.assign(this, updates);
    }
}

module.exports = {
    CreateUserRequest,
    UpdateUserRequest,
};
