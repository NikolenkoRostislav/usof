const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/users", adminAuthMiddleware, controller.getAll);

    app.post("/api/users", adminAuthMiddleware, controller.create);

    app.patch("/api/user/avatar", () => { });

    app.get("/api/users/me", authMiddleware, controller.getSelf);

    app.get("/api/users/:user_id", controller.getById);

    app.patch("/api/users/:user_id", authMiddleware, controller.update);

    app.delete("/api/users/:user_id", authMiddleware, controller.deleteUser);
}

module.exports = { route };
