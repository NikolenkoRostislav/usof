class CreateUserRequest {
    constructor(login, email, password, fullName, role) {
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
