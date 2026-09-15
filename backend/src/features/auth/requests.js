const { AppError, Kind } = require("../../domain/errors");
const Password = require("../../domain/types/password");

class RegisterRequest {
    constructor(login, password, password_confirmation, email, fullName) {
        if (!email.includes('@')) {
            throw new AppError(Kind.InvalidEntry, 'Invalid email');
        }
        Password.validateComplexity(password);

        this.login = login;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.email = email;
        this.fullName = fullName;
    }
}

class ConfirmRegistrationRequest {
    constructor(email, confirm_token) {
        if (!email.includes('@')) {
            throw new AppError(Kind.InvalidEntry, 'Invalid email');
        }
        this.email = email;
        this.confirm_token = confirm_token;
    }
}

class LoginRequest {
    constructor(login, email, password) {
        this.login = login;
        this.email = email;
        this.password = password;
    }
}

class CreatePasswordUpdateIntentRequest {
    constructor(email, new_password) {
        if (!email.includes('@')) {
            throw new AppError(Kind.InvalidEntry, 'Invalid email');
        }
        Password.validateComplexity(new_password);
        this.email = email;
        this.new_password = new_password;
    }
}

class UpdatePasswordRequest {
    constructor(email, confirm_token) {
        if (!email.includes('@')) {
            throw new AppError(Kind.InvalidEntry, 'Invalid email');
        }
        this.email = email;
        this.confirm_token = confirm_token;
    }
}

module.exports = {
    RegisterRequest,
    ConfirmRegistrationRequest,
    LoginRequest,
    CreatePasswordUpdateIntentRequest,
    UpdatePasswordRequest,
};
