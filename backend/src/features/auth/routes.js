const { register, confirmRegistration, login } = require("./controller");


function route(app) {
    app.post("/api/auth/register", register);

    app.post("/api/auth/register/:confirm_token", confirmRegistration);

    app.post("/api/auth/login", login);

    app.post("/api/auth/logout", () => { });

    app.post("/api/auth/password-reset", () => { });

    app.post("/api/auth/password-reset/:confirm_token", () => { });
}

module.exports = { route };
