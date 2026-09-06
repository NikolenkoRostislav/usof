const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/posts/:post_id/likes", controller.getPostLikes);

    app.get("/api/posts/likes", adminAuthMiddleware, controller.getAllPostLikes);

    app.post("/api/posts/:post_id/likes", authMiddleware, controller.createPostLike);

    app.delete("/api/posts/:post_id/likes", authMiddleware, controller.deletePostLike);

    app.get("/api/comments/:comment_id/likes", controller.getCommentLikes);

    app.get("/api/comments/likes", adminAuthMiddleware, controller.getAllCommentLikes);

    app.post("/api/comments/:comment_id/likes", authMiddleware, controller.createCommentLike);

    app.delete("/api/comments/:comment_id/likes", authMiddleware, controller.deleteCommentLike);

    app.delete("/api/likes/:like_id", adminAuthMiddleware, controller.deleteLike);
}

module.exports = { route };
