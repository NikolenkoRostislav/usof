const rewardService = require("./service");
const { GiveRewardRequest } = require("./requests");
const { PostRewardResponse, PostRewardsListResponse } = require("./responses");

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


module.exports = {
    giveReward,
    getPostRewards,
    getMyRewards
};
