function route(app) {
    app.get("/api/users", () => { });

    app.post("/api/users", () => { });

    app.patch("/api/user/avatar", () => { });

    app.get("/api/users/:user_id", () => { });

    app.patch("/api/user/:user_id", () => { });

    app.delete("/api/user/:user_id", () => { });
}

module.exports = { route };
