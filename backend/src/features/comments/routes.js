const { authMiddleware } = require("../../api/middleware");
const { create, getById, getByPostId, update, deleteComment } = require("./controller");

function route(app) {
    app.get("/api/posts/:post_id/comments", getByPostId);

    app.post("/api/posts/:post_id/comments", authMiddleware, create);

    app.get("/api/comments/:comment_id", getById);

    app.patch("/api/comments/:comment_id", authMiddleware, update);

    app.delete("/api/comments/:comment_id", authMiddleware, deleteComment);
}

module.exports = { route };
