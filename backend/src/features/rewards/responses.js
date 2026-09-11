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

module.exports = {
    PostRewardResponse,
    PostRewardsListResponse
};
