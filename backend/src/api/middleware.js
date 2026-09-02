const session = require("express-session");
const { AppError, Kind } = require("../domain/errors.js");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const logErrors = process.env.LOG_ERRORS === "true" ? true : false;

const sessionMiddleware = session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
});

const statusByKind = {
    [Kind.BadRequest]: 400,
    [Kind.InvalidEntry]: 422,
    [Kind.Unauthorized]: 401,
    [Kind.PermissionDenied]: 403,
    [Kind.NotFound]: 404,
    [Kind.Conflict]: 409,
    [Kind.Internal]: 500
};

function errorHandlingMiddleware(error, req, res, _next) {
    if (logErrors)
        console.error("ERROR: ", error);

    if (error instanceof AppError) {
        const status = statusByKind[error.kind] ?? 500;
        return res.status(status).json({ message: error.message });
    }

    return res.status(500).json({
        message: "Internal server error"
    });
}

module.exports = { sessionMiddleware, errorHandlingMiddleware };