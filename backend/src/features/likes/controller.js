const likeService = require("./service");
const { CreatePostLikeRequest, CreateCommentLikeRequest } = require("./requests");
const { LikeResponse, LikesListResponse } = require("./responses");

/**
 * @swagger
 * /api/posts/{post_id}/likes:
 *   post:
 *     tags:
 *       - Likes
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
 *             $ref: '#/components/schemas/CreatePostLikeRequest'
 *     responses:
 *       201:
 *         description: Like created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
async function createPostLike(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;
    const likeRequest = new CreatePostLikeRequest(req.body.type);

    const like = await likeService.createPostLike(userId, post_id, likeRequest.type);
    const response = new LikeResponse(like);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/comments/{comment_id}/likes:
 *   post:
 *     tags:
 *       - Likes
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentLikeRequest'
 *     responses:
 *       201:
 *         description: Like created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
async function createCommentLike(req, res) {
    const userId = req.session.user.id;
    const { comment_id } = req.params;
    const likeRequest = new CreateCommentLikeRequest(req.body.type);

    const like = await likeService.createCommentLike(userId, comment_id, likeRequest.type);
    const response = new LikeResponse(like);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}/likes:
 *   delete:
 *     tags:
 *       - Likes
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
 *          description: Like deleted successfully
 *       401:
 *          description: Unauthorized
 *       404: 
 *          description: Post not found
 */
async function deletePostLike(req, res) {
    const userId = req.session.user.id;
    const { post_id } = req.params;

    await likeService.deletePostLike(userId, post_id);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/comments/{comment_id}/likes:
 *   delete:
 *     tags:
 *       - Likes
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *          description: Like deleted successfully
 *       401:
 *          description: Unauthorized
 *       404: 
 *          description: Comment not found
 */
async function deleteCommentLike(req, res) {
    const userId = req.session.user.id;
    const { comment_id } = req.params;

    await likeService.deleteCommentLike(userId, comment_id);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/posts/{post_id}/likes:
 *   get:
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of likes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikesList'
 *       404:
 *         description: Post not found
 */
async function getPostLikes(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const likes = await likeService.getPostLikes(post_id, isAdmin);
    const response = new LikesListResponse(likes);
    res.json(response);
}

/**
 * @swagger
 * /api/comments/{comment_id}/likes:
 *   get:
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of likes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikesList'
 *       404:
 *         description: Comment not found
 */
async function getCommentLikes(req, res) {
    const { comment_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const likes = await likeService.getCommentLikes(comment_id, isAdmin);
    const response = new LikesListResponse(likes);
    res.json(response);
}

/**
 * @swagger
 * /api/posts/likes:
 *   get:
 *     tags:
 *       - Likes
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of all post likes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikesList'
 *       403:
 *         description: Forbidden
 */
async function getAllPostLikes(req, res) {
    const likes = await likeService.getAllPostLikes();
    const response = new LikesListResponse(likes);
    res.json(response);
}

/**
 * @swagger
 * /api/comments/likes:
 *   get:
 *     tags:
 *       - Likes
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of all comment likes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         enum: [like, dislike]
 *                       authorId:
 *                         type: string
 *                         format: uuid
 *                       postId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       commentId:
 *                         type: string
 *                         format: uuid
 *                       publishDate:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Forbidden
 */
async function getAllCommentLikes(req, res) {
    const likes = await likeService.getAllCommentLikes();
    const response = new LikesListResponse(likes);
    res.json(response);
}

/**
 * @swagger
 * /api/likes/{like_id}:
 *   delete:
 *     tags:
 *       - Likes
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: like_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Like deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Like not found
 */
async function deleteLike(req, res) {
    const { like_id } = req.params;
    await likeService.deleteLike(like_id);
    res.sendStatus(204);
}

module.exports = {
    createPostLike,
    createCommentLike,
    deletePostLike,
    deleteCommentLike,
    getPostLikes,
    getCommentLikes,
    getAllPostLikes,
    getAllCommentLikes,
    deleteLike
};
