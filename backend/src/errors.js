class AppError extends Error {
    constructor(kind, message, cause = null) {
        super(message, { cause });

        this.name = "AppError";
        this.kind = kind;
    }
}

const Kind = Object.freeze({
    Internal: "Internal",
    BadRequest: "BadRequest",
    InvalidEntry: "InvalidEntry",
    Unauthorized: "Unauthorized",
    PermissionDenied: "PermissionDenied",
    NotFound: "NotFound",
    Conflict: "Conflict"
});

module.exports = {
    AppError,
    Kind
};