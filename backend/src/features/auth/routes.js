const controller = require("./controller");
const { authMiddleware } = require("../../api//middleware");

function route(app) {
    app.post("/api/auth/register", controller.register);

    app.post("/api/auth/register/:confirm_token", controller.confirmRegistration);

    app.post("/api/auth/login", controller.login);

    app.post("/api/auth/logout", authMiddleware, controller.logout);

    app.post("/api/auth/password-reset", controller.createPasswordUpdateIntent);

    app.post("/api/auth/password-reset/:confirm_token", controller.updatePassword);
}

module.exports = { route };
