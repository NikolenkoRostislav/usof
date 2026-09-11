class PostRewardResponse {
    constructor(reward) {
        this.postId = reward.postId;
        this.awardId = reward.awardId;
        this.count = reward.count;
        this.award = reward.award;
    }
}

class PostRewardsListResponse {
    constructor(rewards) {
        this.rewards = rewards.map(r => new PostRewardResponse(r));
    }
}

class AwardResponse {
    constructor(award) {
        this.id = award.id;
        this.title = award.title;
        this.description = award.description;
        this.rarity = award.rarity;
    }
}

module.exports = {
    PostRewardResponse,
    PostRewardsListResponse,
    AwardResponse
};
