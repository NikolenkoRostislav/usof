function route(app) {
    app.get("/api/categories", () => { });

    app.post("/api/categories", () => { });

    app.get("/api/categories/:category_id", () => { });

    app.patch("/api/categories/:category_id", () => { });

    app.delete("/api/categories/:category_id", () => { });

    app.get("/api/posts/:post_id/categories", () => { });

}

module.exports = { route };
