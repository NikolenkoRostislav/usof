const User = require("../../domain/entities/user");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function getById(userId) {
    return await transactional(_getById)(userId);
}

async function _getById(uow, userId) {
    const usersRepo = uow.users();

    const user = await usersRepo.findById(userId);
    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    return user;
}

module.exports = { getById };