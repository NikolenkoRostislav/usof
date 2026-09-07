const controller = require("./controller");
const { authMiddleware } = require("../../api//middleware");

function route(app) {
    app.post("/api/auth/register", controller.register);

    app.post("/api/auth/confirm-register", controller.confirmRegistration);

    app.post("/api/auth/login", controller.login);

    app.post("/api/auth/logout", authMiddleware, controller.logout);

    app.post("/api/auth/password-reset", controller.createPasswordUpdateIntent);

    app.post("/api/auth/confirm-password-reset", controller.updatePassword);
}

module.exports = { route };
