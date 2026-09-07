class ConfirmRegistrationResponse {
    constructor(user_id) {
        this.user_id = user_id;
    }
}

class LoginResponse {
    constructor(user_id) {
        this.user_id = user_id;
    }
}

module.exports = {
    ConfirmRegistrationResponse,
    LoginResponse,
};
