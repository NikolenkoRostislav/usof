const postService = require("./service");
const { CreatePostRequest, UpdatePostRequest } = require("./requests");
const { PostResponse, PostsListResponse } = require("./responses");

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [likes, date]
 *           default: likes
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsList'
 */
async function getAll(req, res) {
    const sortBy = req.query.sortBy || 'likes';
    const authorId = req.query.authorId;
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const title = req.query.title;
    const userId = req.session?.user?.id;
    const isAdmin = req.session?.user?.role === 'admin';

    const posts = await postService.getAll({ sortBy, categories, fromDate, toDate, page, limit, authorId, title }, userId, isAdmin);
    const response = new PostsListResponse(posts);
    res.json(response);
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags:
 *       - Posts
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 */
async function create(req, res) {
    const userId = req.session.user.id;
    const createRequest = new CreatePostRequest(req.body.title, req.body.content, req.body.categories);

    const post = await postService.create(userId, createRequest.title, createRequest.content, createRequest.categories);
    const response = new PostResponse(post);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}:
 *   get:
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
async function getById(req, res) {
    const { post_id } = req.params;
    const isAdmin = req.session?.user?.role === 'admin';

    const post = await postService.getById(post_id, isAdmin);
    const response = new PostResponse(post);
    res.json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}:
 *   patch:
 *     tags:
 *       - Posts
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
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
async function update(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { post_id } = req.params;
    const updateRequest = new UpdatePostRequest(
        req.body.status,
        req.body.title,
        req.body.content,
        req.body.categories
    );

    const post = await postService.update(post_id, userId, isAdmin, updateRequest);
    const response = new PostResponse(post);
    res.json(response);
}

/**
 * @swagger
 * /api/posts/{post_id}:
 *   delete:
 *     tags:
 *       - Posts
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
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
async function deletePost(req, res) {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const { post_id } = req.params;

    await postService.deletePost(post_id, userId, isAdmin);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/categories/{category_id}/posts:
 *   get:
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [likes, date]
 *           default: likes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsList'
 *       404:
 *          description: Category not found
 */
async function getByCategory(req, res) {
    const { category_id } = req.params;
    const sortBy = req.query.sortBy || 'likes';
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const userId = req.session?.user?.id;
    const isAdmin = req.session?.user?.role === 'admin';

    const posts = await postService.getByCategory(category_id, { sortBy, page, limit }, userId, isAdmin);
    const response = new PostsListResponse(posts);
    res.json(response);
}

module.exports = { getAll, create, getById, update, deletePost, getByCategory };
