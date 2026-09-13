const awardService = require("./service");
const { GiveAwardRequest, CreateAwardRequest } = require("./requests");
const { PostAwardResponse, PostAwardsListResponse, AwardResponse } = require("./responses");

/**
 * @swagger
 * /api/posts/{post_id}/awards:
 *   post:
 *     tags:
 *       - Awards
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
 *             $ref: '#/components/schemas/GiveAwardRequest'
 *     responses:
 *       201:
 *         description: Award given successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostAward'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       409:
 *         description: User does not have this award
 */
async function giveAward(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const giveAwardRequest = new GiveAwardRequest(req.body.awardId);

    const award = await awardService.giveAwardToPost(userId, post_id, giveAwardRequest.awardId);
    const response = new PostAwardResponse(award);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}/awards:
 *   get:
 *     tags:
 *       - Awards
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of awards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostAwardsList'
 *       404:
 *         description: Post not found
 */
async function getPostAwards(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const awards = await awardService.getPostAwards(post_id, isAdmin);
    const response = new PostAwardsListResponse(awards);
    res.json(response);
}

/**
 * @swagger
 * /api/awards/me:
 *   get:
 *     tags:
 *       - Awards
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of user's awards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostAwardsList'
 *       401:
 *         description: Unauthorized
 */
async function getMyAwards(req, res) {
    const awards = await awardService.getMyAwards(req.session.user.id);
    const response = new PostAwardsListResponse(awards);
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
    const awardRequest = new CreateAwardRequest(req.body.title, req.body.description, req.body.rarity);
    const award = await awardService.createAward(awardRequest.title, awardRequest.description, awardRequest.rarity);
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
    await awardService.deleteAward(award_id);
    res.sendStatus(204);
}

module.exports = {
    giveAward,
    getPostAwards,
    getMyAwards,
    createAward,
    deleteAward
};
