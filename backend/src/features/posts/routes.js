function route(app) {
    app.get("/api/posts", () => { });

    app.post("/api/posts", () => { });

    app.get("/api/posts/:post_id", () => { });

    app.patch("/api/posts/:post_id", () => { });

    app.delete("/api/posts/:post_id", () => { });

    app.get("/api/categories/:category_id/posts", () => { });
}

module.exports = { route };
