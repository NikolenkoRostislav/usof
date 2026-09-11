const rewardService = require("./service");
const { GiveRewardRequest, CreateAwardRequest } = require("./requests");
const { PostRewardResponse, PostRewardsListResponse, AwardResponse } = require("./responses");

/**
 * @swagger
 * /api/posts/{post_id}/rewards:
 *   post:
 *     tags:
 *       - Rewards
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GiveRewardRequest'
 *     responses:
 *       201:
 *         description: Reward given successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostReward'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       409:
 *         description: User does not have this award
 */
async function giveReward(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const { awardId } = req.body;

    const reward = await rewardService.giveRewardToPost(userId, post_id, awardId);
    const response = new PostRewardResponse(reward);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}/rewards:
 *   get:
 *     tags:
 *       - Rewards
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of rewards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostRewardsList'
 *       404:
 *         description: Post not found
 */
async function getPostRewards(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const rewards = await rewardService.getPostRewards(post_id, isAdmin);
    const response = new PostRewardsListResponse(rewards);
    res.json(response);
}

/**
 * @swagger
 * /api/rewards/me:
 *   get:
 *     tags:
 *       - Rewards
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of user's rewards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostRewardsList'
 *       401:
 *         description: Unauthorized
 */
async function getMyRewards(req, res) {
    const rewards = await rewardService.getMyRewards(req.session.user.id);
    const response = new PostRewardsListResponse(rewards);
    res.json(response);
}

/**
 * @swagger
 * /api/awards:
 *   post:
 *     tags:
 *       - Awards
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAwardRequest'
 *     responses:
 *       201:
 *         description: Award created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
 *       400:
 *         description: Invalid rarity
 *       403:
 *         description: Forbidden
 */
async function createAward(req, res) {
    const { title, description, rarity } = req.body;
    const award = await rewardService.createAward(title, description, rarity);
    const response = new AwardResponse(award);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/awards/{award_id}:
 *   delete:
 *     tags:
 *       - Awards
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: award_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Award deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Award not found
 */
async function deleteAward(req, res) {
    const { award_id } = req.params;
    await rewardService.deleteAward(award_id);
    res.sendStatus(204);
}

module.exports = {
    giveReward,
    getPostRewards,
    getMyRewards,
    createAward,
    deleteAward
};
