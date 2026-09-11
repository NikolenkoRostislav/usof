const { authMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.post("/api/posts/:post_id/rewards", authMiddleware, controller.giveReward);

    app.get("/api/posts/:post_id/rewards", controller.getPostRewards);

    app.get("/api/rewards/me", authMiddleware, controller.getMyRewards);
}

module.exports = { route };
