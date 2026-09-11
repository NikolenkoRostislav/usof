class GachaStatusResponse {
    constructor(msUntilNextRoll) {
        this.msUntilNextRoll = msUntilNextRoll;
        this.canRoll = msUntilNextRoll <= 0;
    }
}

class GachaRollResponse {
    constructor(award) {
        this.award = award;
    }
}

module.exports = {
    GachaStatusResponse,
    GachaRollResponse
};
