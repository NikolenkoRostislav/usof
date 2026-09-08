class AwardGacha {
    constructor({ userId, lastRolled = null, totalRolls = 0 }) {
        this.userId = userId;
        this.lastRolled = lastRolled;
        this.totalRolls = totalRolls;
    }
}

module.exports = AwardGacha;
