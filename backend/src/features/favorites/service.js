const Favorite = require("../../domain/entities/favorite");
const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function addFavorite(userId, postId) {
    return await transactional(_addFavorite)(userId, postId);
}

async function _addFavorite(uow, userId, postId) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const favorite = new Favorite({
        userId,
        postId
    });

    const favoritesRepo = uow.favorites();
    await favoritesRepo.save(favorite);
    return favorite;
}

async function removeFavorite(userId, postId) {
    return await transactional(_removeFavorite)(userId, postId);
}

async function _removeFavorite(uow, userId, postId) {
    const favoritesRepo = uow.favorites();
    const favorite = await favoritesRepo.findByUserAndPost(userId, postId);

    if (!favorite) {
        throw new AppError(Kind.NotFound, "Favorite not found");
    }

    await favoritesRepo.delete(userId, postId);
}

async function getUserFavorites(userId) {
    const uow = await getReadOnlyUoW();
    const favoritesRepo = uow.favorites();
    return await favoritesRepo.findByUserId(userId);
}

async function isFavorited(userId, postId) {
    const uow = await getReadOnlyUoW();
    const favoritesRepo = uow.favorites();
    const favorite = await favoritesRepo.findByUserAndPost(userId, postId);
    return favorite !== null;
}

module.exports = {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    isFavorited,
};
