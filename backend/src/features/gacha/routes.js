const { authMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/gacha/status", authMiddleware, controller.getStatus);

    app.post("/api/gacha/roll", authMiddleware, controller.roll);
}

module.exports = { route };
