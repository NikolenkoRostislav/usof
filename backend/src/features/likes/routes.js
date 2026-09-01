function route(app) {
    app.get("/api/posts/:post_id/like", () => { });

    app.post("/api/posts/:post_id/like", () => { });

    app.delete("/api/posts/:post_id/like", () => { });

    app.get("/api/comments/:comment_id/like", () => { });

    app.post("/api/comments/:comment_id/like", () => { });

    app.delete("/api/comments/:comment_id/like", () => { });
}

module.exports = { route };
