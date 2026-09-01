function route(app) {
    app.get("/api/posts/:post_id/comments", () => { });

    app.post("/api/posts/:post_id/comments", () => { });

    app.get("/api/comments/:comment_id", () => { });

    app.patch("/api/comments/:comment_id", () => { });

    app.delete("/api/comments/:comment_id", () => { });
}

module.exports = { route };
