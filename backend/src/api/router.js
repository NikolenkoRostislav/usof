const { route: authRoute } = require("../features/auth/routes");
const { route: categoriesRoute } = require("../features/categories/routes");
const { route: commentsRoute } = require("../features/comments/routes");
const { route: likesRoute } = require("../features/likes/routes");
const { route: postsRoute } = require("../features/posts/routes");
const { route: userRoute } = require("../features/users/routes");


function route(app) {
    app.get("/api/health", (req, res) => {
        res.status(200).json({ message: "OK" });
    });

    authRoute(app);
    categoriesRoute(app);
    commentsRoute(app);
    likesRoute(app);
    postsRoute(app);
    userRoute(app);
}

module.exports = route;