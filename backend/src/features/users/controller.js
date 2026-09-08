const userService = require("./service");
const { CreateUserRequest, UpdateUserRequest } = require("./requests");
const { UserResponse, UserFullResponse, UsersListResponse } = require("./responses");

/**
 * @swagger
 * /api/users/{user_id}:
 *   get:
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
async function getById(req, res) {
    const { user_id } = req.params;
    const user = await userService.getById(user_id);
    const response = new UserResponse(user);
    res.json(response);
}

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFull'
 *       401:
 *         description: Unauthorized
 */
async function getSelf(req, res) {
    const userId = req.session.user.id;
    const user = await userService.getById(userId);
    const response = new UserFullResponse(user);
    res.json(response);
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersList'
 *       403:
 *         description: Forbidden
 */
async function getAll(req, res) {
    const users = await userService.getAll();
    const response = new UsersListResponse(users);
    res.json(response);
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFull'
 *       403:
 *         description: Forbidden
 */
async function create(req, res) {
    const createRequest = new CreateUserRequest(
        req.body.login,
        req.body.email,
        req.body.password,
        req.body.fullName,
        req.body.role
    );
    const user = await userService.create(
        createRequest.login,
        createRequest.email,
        createRequest.password,
        createRequest.fullName,
        createRequest.role
    );
    const response = new UserFullResponse(user);
    res.status(201).json(response);
}

/**
 * @swagger
 * /api/users/{user_id}:
 *   patch:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
async function update(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;
    const updateRequest = new UpdateUserRequest(req.body);

    const user = await userService.update(user_id, requestingUserId, requestingUserRole, updateRequest);
    const response = new UserResponse(user);
    res.json(response);
}

/**
 * @swagger
 * /api/users/{user_id}:
 *   delete:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
async function deleteUser(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;

    await userService.deleteUser(user_id, requestingUserId, requestingUserRole);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/users/{user_id}/avatar:
 *   get:
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: User not found
 */
async function getAvatar(req, res) {
    const { user_id } = req.params;

    const avatar = await userService.getAvatar(user_id);
    res.set("Content-Type", "image/png");
    res.send(avatar);
}

/**
 * @swagger
 * /api/users/{user_id}/avatar:
 *   delete:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
async function deleteAvatar(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';

    await userService.deleteAvatar(user_id, requestingUserId, isAdmin);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/users/{user_id}/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
async function updateAvatar(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await userService.updateAvatar(user_id, requestingUserId, isAdmin, req.file.buffer, req.file.mimetype);
    const response = new UserResponse(user);
    res.json(response);
}

module.exports = { getById, getSelf, getAll, create, update, deleteUser, getAvatar, deleteAvatar, updateAvatar };