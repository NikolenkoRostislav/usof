const { transactional, getReadOnlyUoW } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

const RARITY_WEIGHTS = {
    'common': 50,
    'rare': 30,
    'epic': 15,
    'legendary': 5
};

async function getGachaStatus(userId, isAdmin) {
    const uow = await getReadOnlyUoW();
    const gachaRepo = uow.awardGacha();
    const gacha = await gachaRepo.findByUserId(userId);

    if (isAdmin) {
        return 0;
    }

    if (!gacha || !gacha.lastRolled) {
        return 0;
    }

    const lastRolledTime = new Date(gacha.lastRolled).getTime();
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const msUntilNextRoll = lastRolledTime + oneDayMs - now;

    return Math.max(0, msUntilNextRoll);
}

async function rollAward(userId, isAdmin) {
    return await transactional(_rollAward)(userId, isAdmin);
}

async function _rollAward(uow, userId, isAdmin) {
    const gachaRepo = uow.awardGacha();
    const gacha = await gachaRepo.findByUserId(userId);

    if (!isAdmin && gacha && gacha.lastRolled) {
        const lastRolledTime = new Date(gacha.lastRolled).getTime();
        const now = new Date().getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (now - lastRolledTime < oneDayMs) {
            throw new AppError(Kind.Conflict, "You can only roll once per day");
        }
    }

    const awardsRepo = uow.awards();
    const awards = await awardsRepo.findAll();

    if (!awards || awards.length === 0) {
        throw new AppError(Kind.NotFound, "No awards available");
    }

    const selectedAward = selectRandomAward(awards);

    const ownedAwardsRepo = uow.ownedAwards();
    const userAward = await ownedAwardsRepo.findByUserIdAndAwardId(userId, selectedAward.id);

    const newCount = (userAward?.count || 0) + 1;
    await ownedAwardsRepo.save(userId, selectedAward.id, newCount);

    const now = new Date();
    const newTotalRolls = (gacha?.totalRolls || 0) + 1;
    await gachaRepo.save(userId, now, newTotalRolls);

    return {
        id: selectedAward.id,
        title: selectedAward.title,
        description: selectedAward.description,
        rarity: selectedAward.rarity
    };
}

function selectRandomAward(awards) {
    const weightedAwards = awards.map(award => ({
        award,
        weight: RARITY_WEIGHTS[award.rarity] || 0
    }));

    const totalWeight = weightedAwards.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedAwards) {
        random -= item.weight;
        if (random <= 0) {
            return item.award;
        }
    }

    return weightedAwards[weightedAwards.length - 1].award;
}

module.exports = {
    getGachaStatus,
    rollAward
};
