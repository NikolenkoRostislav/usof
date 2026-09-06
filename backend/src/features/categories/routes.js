const { adminAuthMiddleware, authMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/categories", adminAuthMiddleware, controller.getAll);

    app.post("/api/categories", adminAuthMiddleware, controller.create);

    app.get("/api/categories/:category_id", authMiddleware, controller.getById);

    app.patch("/api/categories/:category_id", adminAuthMiddleware, controller.update);

    app.delete("/api/categories/:category_id", adminAuthMiddleware, controller.deleteCategory);
}

module.exports = { route };
