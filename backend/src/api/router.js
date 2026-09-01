function route(app) {
    app.get("/api/health", (req, res) => {
        res.status(200).json({ message: "OK" });
    });
}

module.exports = route;