const User = require("../../domain/entities/user");
const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");
const fileHandler = require("../../infra/file_handler/dev");

async function getById(userId) {
    const uow = await getReadOnlyUoW();
    const likesRepo = uow.likes();
    const usersRepo = uow.users();

    const user = await usersRepo.findById(userId);
    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    const reputation = await likesRepo.calculateUserReputation(userId);
    user.reputation = reputation;

    return user;
}

async function getAll() {
    const uow = await getReadOnlyUoW();
    const usersRepo = uow.users();
    return await usersRepo.findAll();
}

async function create(login, email, password, fullName, role = "user") {
    return await transactional(_create)(login, email, password, fullName, role);
}

async function _create(uow, login, email, password, fullName, role) {
    if (!['user', 'admin'].includes(role)) {
        throw new AppError(Kind.InvalidEntry, "Role must be 'user' or 'admin'");
    }

    const usersRepo = uow.users();

    const existingLogin = await usersRepo.findByLogin(login);
    if (existingLogin) {
        throw new AppError(Kind.Conflict, "Login already exists");
    }

    const existingEmail = await usersRepo.findByEmail(email);
    if (existingEmail) {
        throw new AppError(Kind.Conflict, "Email already exists");
    }

    const user = new User({ login, email, fullName, role });
    await user.setPassword(password);
    await usersRepo.save(user);
    return user;
}

async function update(userId, requestingUserId, requestingUserRole, updates) {
    return await transactional(_update)(userId, requestingUserId, requestingUserRole, updates);
}

async function _update(uow, userId, requestingUserId, requestingUserRole, updates) {
    const usersRepo = uow.users();
    const user = await usersRepo.findById(userId);

    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    if (userId !== requestingUserId && requestingUserRole !== "admin") {
        throw new AppError(Kind.PermissionDenied, "You cannot update this user");
    }

    if (updates.login !== undefined) {
        const existingLogin = await usersRepo.findByLogin(updates.login);
        if (existingLogin && existingLogin.id !== userId) {
            throw new AppError(Kind.Conflict, "Login already exists");
        }
        user.login = updates.login;
    }

    if (updates.fullName !== undefined) {
        user.fullName = updates.fullName;
    }

    await usersRepo.save(user);
    return user;
}

async function deleteUser(userId, requestingUserId, requestingUserRole) {
    return await transactional(_deleteUser)(userId, requestingUserId, requestingUserRole);
}

async function _deleteUser(uow, userId, requestingUserId, requestingUserRole) {
    const usersRepo = uow.users();
    const user = await usersRepo.findById(userId);

    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    if (userId !== requestingUserId && requestingUserRole !== "admin") {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this user");
    }

    await usersRepo.delete(userId);
}

async function getAvatar(userId) {
    const uow = await getReadOnlyUoW();
    const usersRepo = uow.users();
    const user = await usersRepo.findById(userId);
    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }
    const pfpKey = user.pfpKey;
    if (!pfpKey) {
        return null;
    }

    return fileHandler.getFile(pfpKey);
}

async function deleteAvatar(userId, requestingUserId, isAdmin) {
    return await transactional(_deleteAvatar)(userId, requestingUserId, isAdmin);
}

async function _deleteAvatar(uow, userId, requestingUserId, isAdmin) {
    if (userId !== requestingUserId && !isAdmin) {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this user's avatar");
    }

    const usersRepo = uow.users();
    const user = await usersRepo.findById(userId);
    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    await fileHandler.deleteFile(user.pfpKey);

    user.pfpKey = null;
    await usersRepo.save(user);
}

async function updateAvatar(userId, requestingUserId, isAdmin, fileBuffer, mimetype) {
    return await transactional(_updateAvatar)(userId, requestingUserId, isAdmin, fileBuffer, mimetype);
}

async function _updateAvatar(uow, userId, requestingUserId, isAdmin, fileBuffer, mimetype) {
    if (userId !== requestingUserId && !isAdmin) {
        throw new AppError(Kind.PermissionDenied, "You cannot update this user's avatar");
    }

    if (mimetype !== "image/png") {
        throw new AppError(Kind.InvalidEntry, "Only PNG files are allowed");
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSizeBytes) {
        throw new AppError(Kind.InvalidEntry, "File size must not exceed 5MB");
    }

    const usersRepo = uow.users();
    const user = await usersRepo.findById(userId);
    if (!user) {
        throw new AppError(Kind.NotFound, "User not found");
    }

    if (user.pfpKey) {
        await fileHandler.deleteFile(user.pfpKey);
    }

    const newKey = await fileHandler.saveFile(fileBuffer);
    user.pfpKey = newKey;
    await usersRepo.save(user);

    return user;
}


module.exports = { getById, getAll, create, update, deleteUser, getAvatar, deleteAvatar, updateAvatar };