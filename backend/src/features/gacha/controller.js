const gachaService = require("./service");
const { GachaStatusResponse, GachaRollResponse } = require("./responses");

/**
 * @swagger
 * /api/gacha/status:
 *   get:
 *     tags:
 *       - Gacha
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Time until next roll in milliseconds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GachaStatus'
 *       401:
 *         description: Unauthorized
 */
async function getStatus(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';

    const msUntilNextRoll = await gachaService.getGachaStatus(userId, isAdmin);
    const response = new GachaStatusResponse(msUntilNextRoll);
    res.json(response);
}

/**
 * @swagger
 * /api/gacha/roll:
 *   post:
 *     tags:
 *       - Gacha
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Award obtained from gacha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GachaRoll'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No awards available
 *       409:
 *         description: Can only roll once per day
 */
async function roll(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';

    const award = await gachaService.rollAward(userId, isAdmin);
    const response = new GachaRollResponse(award);
    res.json(response);
}

module.exports = {
    getStatus,
    roll
};
