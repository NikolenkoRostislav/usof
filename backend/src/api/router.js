const { route: authRoute } = require("../features/auth/routes");
const { route: categoriesRoute } = require("../features/categories/routes");
const { route: commentsRoute } = require("../features/comments/routes");
const { route: likesRoute } = require("../features/likes/routes");
const { route: postsRoute } = require("../features/posts/routes");
const { route: userRoute } = require("../features/users/routes");
const { route: awardsRoute } = require("../features/awards/routes");
const { route: gachaRoute } = require("../features/gacha/routes");


function route(app) {
    app.get("/api/health", (req, res) => {
        res.json({ message: "OK" });
    });

    authRoute(app);
    categoriesRoute(app);
    likesRoute(app);
    commentsRoute(app);
    postsRoute(app);
    userRoute(app);
    awardsRoute(app);
    gachaRoute(app);
}

module.exports = route;