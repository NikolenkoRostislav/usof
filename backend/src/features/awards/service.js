const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");
const Award = require("../../domain/entities/award");

async function giveAwardToPost(userId, postId, awardId) {
    return await transactional(_giveAwardToPost)(userId, postId, awardId);
}

async function _giveAwardToPost(uow, userId, postId, awardId) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const awardsRepo = uow.awards();
    const award = await awardsRepo.findById(awardId);

    if (!award) {
        throw new AppError(Kind.NotFound, "Award not found");
    }

    const ownedAwardsRepo = uow.ownedAwards();
    const userAward = await ownedAwardsRepo.findByUserIdAndAwardId(userId, awardId);

    if (!userAward || userAward.count < 1) {
        throw new AppError(Kind.Conflict, "User does not have this award");
    }

    const newCount = userAward.count - 1;
    await ownedAwardsRepo.save(userId, awardId, newCount);

    const postAwardsRepo = uow.postAwards();
    const postAward = await postAwardsRepo.findByPostIdAndAwardId(postId, awardId);

    const newPostCount = (postAward?.count || 0) + 1;
    await postAwardsRepo.save(postId, awardId, newPostCount);

    return {
        postId,
        awardId,
        count: newPostCount,
        award: {
            id: award.id,
            title: award.title,
            description: award.description,
            rarity: award.rarity
        }
    };
}

async function getPostAwards(postId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post || (post.status === "inactive" && !isAdmin)) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const postAwardsRepo = uow.postAwards();
    return await postAwardsRepo.findByPostId(postId);
}

async function getMyAwards(userId) {
    const uow = await getReadOnlyUoW();
    const ownedAwardsRepo = uow.ownedAwards();
    return await ownedAwardsRepo.findByUserId(userId);
}

async function createAward(title, description, rarity) {
    return await transactional(_createAward)(title, description, rarity);
}

async function _createAward(uow, title, description, rarity) {
    if (!['common', 'rare', 'epic', 'legendary'].includes(rarity)) {
        throw new AppError(Kind.BadRequest, "Invalid rarity");
    }

    const award = new Award({
        title,
        description,
        rarity
    });

    const awardsRepo = uow.awards();
    await awardsRepo.save(award);
    return award;
}

async function deleteAward(awardId) {
    return await transactional(_deleteAward)(awardId);
}

async function _deleteAward(uow, awardId) {
    const awardsRepo = uow.awards();
    const award = await awardsRepo.findById(awardId);

    if (!award) {
        throw new AppError(Kind.NotFound, "Award not found");
    }

    await awardsRepo.delete(awardId);
}

module.exports = {
    giveAwardToPost,
    getPostAwards,
    getMyAwards,
    createAward,
    deleteAward
};
