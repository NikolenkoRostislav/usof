const { authMiddleware } = require("../../api/middleware");
const {
    createPostLike,
    createCommentLike,
    deletePostLike,
    deleteCommentLike,
    getPostLikes,
    getCommentLikes
} = require("./controller");

function route(app) {
    app.get("/api/posts/:post_id/likes", getPostLikes);

    app.post("/api/posts/:post_id/likes", authMiddleware, createPostLike);

    app.delete("/api/posts/:post_id/likes", authMiddleware, deletePostLike);

    app.get("/api/comments/:comment_id/likes", getCommentLikes);

    app.post("/api/comments/:comment_id/likes", authMiddleware, createCommentLike);

    app.delete("/api/comments/:comment_id/likes", authMiddleware, deleteCommentLike);
}

module.exports = { route };
