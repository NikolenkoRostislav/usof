const { authMiddleware } = require("../../api/middleware");
const controller = require("./controller");

function route(app) {
    app.get("/api/favorites", authMiddleware, controller.getUserFavorites);

    app.post("/api/favorites/:post_id", authMiddleware, controller.addFavorite);

    app.delete("/api/favorites/:post_id", authMiddleware, controller.removeFavorite);
}

module.exports = { route };
