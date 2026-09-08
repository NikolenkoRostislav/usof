class UserResponse {
    constructor(user) {
        this.id = user.id;
        this.login = user.login;
        this.role = user.role;
        this.reputation = user.reputation || 0;
    }
}

class UserFullResponse {
    constructor(user) {
        this.id = user.id;
        this.login = user.login;
        this.email = user.email;
        this.fullName = user.fullName;
        this.role = user.role;
        this.reputation = user.reputation || 0;
    }
}

class UsersListResponse {
    constructor(users) {
        this.users = users.map(u => new UserResponse(u));
    }
}

module.exports = {
    UserResponse,
    UserFullResponse,
    UsersListResponse,
};
