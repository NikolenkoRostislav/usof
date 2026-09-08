const { authMiddleware, adminAuthMiddleware } = require("../../api/middleware");
const controller = require("./controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

function route(app) {

    app.get("/api/users", adminAuthMiddleware, controller.getAll);

    app.post("/api/users", adminAuthMiddleware, controller.create);

    app.get("/api/users/:user_id/avatar", controller.getAvatar);

    app.patch("/api/users/:user_id/avatar", authMiddleware, upload.single("file"), controller.updateAvatar);

    app.delete("/api/users/:user_id/avatar", authMiddleware, controller.deleteAvatar);

    app.get("/api/users/me", authMiddleware, controller.getSelf);

    app.get("/api/users/:user_id", controller.getById);

    app.patch("/api/users/:user_id", authMiddleware, controller.update);

    app.delete("/api/users/:user_id", authMiddleware, controller.deleteUser);
}

module.exports = { route };
