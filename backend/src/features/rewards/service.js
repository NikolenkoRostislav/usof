const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function giveRewardToPost(userId, postId, awardId) {
    return await transactional(_giveRewardToPost)(userId, postId, awardId);
}

async function _giveRewardToPost(uow, userId, postId, awardId) {
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

async function getPostRewards(postId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post || (post.status === "inactive" && !isAdmin)) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const postAwardsRepo = uow.postAwards();
    return await postAwardsRepo.findByPostId(postId);
}

async function getMyRewards(userId) {
    const uow = await getReadOnlyUoW();
    const ownedAwardsRepo = uow.ownedAwards();
    return await ownedAwardsRepo.findByUserId(userId);
}

module.exports = {
    giveRewardToPost,
    getPostRewards,
    getMyRewards
};
