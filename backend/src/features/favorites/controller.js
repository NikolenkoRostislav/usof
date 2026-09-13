const favoriteService = require("./service");
const { FavoriteResponse, FavoritesListResponse, IsFavoritedResponse } = require("./responses");

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags:
 *       - Favorites
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoritesList'
 *       401:
 *         description: Unauthorized
 */
async function getUserFavorites(req, res) {
    const userId = req.session.user.id;
    const favorites = await favoriteService.getUserFavorites(userId);
    const response = new FavoritesListResponse(favorites);
    res.json(response);
}

/**
 * @swagger
 * /api/favorites/{post_id}:
 *   post:
 *     tags:
 *       - Favorites
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       409:
 *         description: Post is already in favorites
 */
async function addFavorite(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    const favorite = await favoriteService.addFavorite(userId, post_id);
    const response = new FavoriteResponse(favorite);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/favorites/{post_id}:
 *   delete:
 *     tags:
 *       - Favorites
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *          description: Favorite removed successfully
 *       401:
 *          description: Unauthorized
 *       404:
 *          description: Favorite not found
 */
async function removeFavorite(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    await favoriteService.removeFavorite(userId, post_id);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/favorites/{post_id}:
 *   get:
 *     tags:
 *       - Favorites
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Check if post is favorited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IsFavorited'
 *       401:
 *         description: Unauthorized
 */
async function checkIsFavorited(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    const isFavorited = await favoriteService.isFavorited(userId, post_id);
    const response = new IsFavoritedResponse(isFavorited);
    res.json(response);
}

module.exports = {
    getUserFavorites,
    addFavorite,
    removeFavorite,
    checkIsFavorited,
};
