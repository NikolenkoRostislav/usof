class GiveRewardRequest {
    constructor(awardId) {
        this.awardId = awardId;
    }
}

class CreateAwardRequest {
    constructor(title, description, rarity) {
        this.title = title;
        this.description = description;
        this.rarity = rarity;
    }
}

module.exports = {
    GiveRewardRequest,
    CreateAwardRequest
};
