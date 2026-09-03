const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const { getById, getSelf } = require("./controller");

function route(app) {
    app.get("/api/users", adminAuthMiddleware, () => { });

    app.post("/api/users", adminAuthMiddleware, () => { });

    app.patch("/api/user/avatar", () => { });

    app.get("/api/users/me", authMiddleware, getSelf);

    app.get("/api/users/:user_id", getById);

    app.patch("/api/users/:user_id", authMiddleware, () => { });

    app.delete("/api/users/:user_id", authMiddleware, () => { });
}

module.exports = { route };
