class PostAwardResponse {
    constructor(award) {
        this.postId = award.postId;
        this.awardId = award.awardId;
        this.count = award.count;
        this.award = award.award;
    }
}

class PostAwardsListResponse {
    constructor(awards) {
        this.awards = awards.map(r => new PostAwardResponse(r));
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
    PostAwardResponse,
    PostAwardsListResponse,
    AwardResponse
};
