const { authMiddleware } = require("../../api/middleware");
const { getAll, create, getById, update, deletePost, getByCategory } = require("./controller");

function route(app) {
    app.get("/api/posts", getAll);

    app.post("/api/posts", authMiddleware, create);

    app.get("/api/posts/:post_id", getById);

    app.patch("/api/posts/:post_id", authMiddleware, update);

    app.delete("/api/posts/:post_id", authMiddleware, deletePost);

    app.get("/api/categories/:category_id/posts", getByCategory);
}

module.exports = { route };
