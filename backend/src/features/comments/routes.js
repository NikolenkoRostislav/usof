const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/comments", adminAuthMiddleware, controller.getAll);

    app.get("/api/posts/:post_id/comments", controller.getByPostId);

    app.post("/api/posts/:post_id/comments", authMiddleware, controller.create);

    app.get("/api/comments/:comment_id", controller.getById);

    app.patch("/api/comments/:comment_id", authMiddleware, controller.update);

    app.delete("/api/comments/:comment_id", authMiddleware, controller.deleteComment);
}

module.exports = { route };
