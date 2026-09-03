const { register, confirmRegistration, login, logout, createPasswordUpdateIntent, updatePassword } = require("./controller");
const { authMiddleware } = require("../../api//middleware");

function route(app) {
    app.post("/api/auth/register", register);

    app.post("/api/auth/register/:confirm_token", confirmRegistration);

    app.post("/api/auth/login", login);

    app.post("/api/auth/logout", authMiddleware, logout);

    app.post("/api/auth/password-reset", createPasswordUpdateIntent);

    app.post("/api/auth/password-reset/:confirm_token", updatePassword);
}

module.exports = { route };
