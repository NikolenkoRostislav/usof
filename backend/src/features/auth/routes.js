function route(app) {
    app.post("/api/auth/register", () => { });

    app.post("/api/auth/register/:confirm_token", () => { });

    app.post("/api/auth/login", () => { });

    app.post("/api/auth/logout", () => { });

    app.post("/api/auth/password-reset", () => { });

    app.post("/api/auth/password-reset/:confirm_token", () => { });
}

module.exports = { route };
