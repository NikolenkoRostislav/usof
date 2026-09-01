const { route: authRoute } = require("../features/auth/routes.js");
const { route: categoriesRoute } = require("../features/categories/routes.js");
const { route: commentsRoute } = require("../features/comments/routes.js");
const { route: likesRoute } = require("../features/likes/routes.js");
const { route: postsRoute } = require("../features/posts/routes.js");
const { route: userRoute } = require("../features/users/routes.js");


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