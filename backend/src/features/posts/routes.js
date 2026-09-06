const { authMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/posts", controller.getAll);

    app.post("/api/posts", authMiddleware, controller.create);

    app.get("/api/posts/:post_id", controller.getById);

    app.patch("/api/posts/:post_id", authMiddleware, controller.update);

    app.delete("/api/posts/:post_id", authMiddleware, controller.deletePost);

    app.get("/api/categories/:category_id/posts", controller.getByCategory);
}

module.exports = { route };
