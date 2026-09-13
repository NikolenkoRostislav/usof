const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.post("/api/posts/:post_id/awards", authMiddleware, controller.giveAward);

    app.get("/api/posts/:post_id/awards", controller.getPostAwards);

    app.get("/api/awards", controller.getAwards);

    app.get("/api/awards/me", authMiddleware, controller.getMyAwards);

    app.post("/api/awards", adminAuthMiddleware, controller.createAward);

    app.delete("/api/awards/:award_id", adminAuthMiddleware, controller.deleteAward);
}

module.exports = { route };
