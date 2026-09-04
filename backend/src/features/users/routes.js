const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const { getById, getSelf, getAll, create, update, deleteUser } = require("./controller");

function route(app) {
    app.get("/api/users", adminAuthMiddleware, getAll);

    app.post("/api/users", adminAuthMiddleware, create);

    app.patch("/api/user/avatar", () => { });

    app.get("/api/users/me", authMiddleware, getSelf);

    app.get("/api/users/:user_id", getById);

    app.patch("/api/users/:user_id", authMiddleware, update);

    app.delete("/api/users/:user_id", authMiddleware, deleteUser);
}

module.exports = { route };
