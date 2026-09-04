const { adminAuthMiddleware, authMiddleware } = require("../../api/middleware");
const { getAll, create, getById, update, deleteCategory } = require("./controller");

function route(app) {
    app.get("/api/categories", adminAuthMiddleware, getAll);

    app.post("/api/categories", adminAuthMiddleware, create);

    app.get("/api/categories/:category_id", authMiddleware, getById);

    app.patch("/api/categories/:category_id", adminAuthMiddleware, update);

    app.delete("/api/categories/:category_id", adminAuthMiddleware, deleteCategory);
}

module.exports = { route };
