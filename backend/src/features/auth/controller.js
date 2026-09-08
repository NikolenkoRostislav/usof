const authService = require("./service");
const {
    RegisterRequest,
    ConfirmRegistrationRequest,
    LoginRequest,
    CreatePasswordUpdateIntentRequest,
    UpdatePasswordRequest,
} = require("./requests");
const {
    ConfirmRegistrationResponse,
    LoginResponse,
} = require("./responses");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Validation error
 */
async function register(req, res) {
    const registerRequest = new RegisterRequest(req.body.login, req.body.password, req.body.password_confirmation, req.body.email, req.body.fullName);
    if (registerRequest.password !== registerRequest.password_confirmation) {
        return res.status(422).json({ message: "Passwords do not match" });
    }

    await authService.register({ login: registerRequest.login, password: registerRequest.password, email: registerRequest.email, fullName: registerRequest.fullName });
    res.sendStatus(201);
}

/**
 * @swagger
 * /api/auth/confirm-register:
 *   post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmRegistrationRequest'
 *     responses:
 *       200:
 *         description: Registration confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfirmRegistrationResponse'
 */
async function confirmRegistration(req, res) {
    const confirmRequest = new ConfirmRegistrationRequest(req.body.email, req.body.confirm_token);
    const user = await authService.confirmRegistration(confirmRequest.email, confirmRequest.confirm_token);
    req.session.user = {
        id: user.id,
        role: user.role,
    };
    const response = new ConfirmRegistrationResponse(user.id);
    res.json(response);
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
async function login(req, res) {
    const loginRequest = new LoginRequest(req.body.login, req.body.email, req.body.password);
    const user = await authService.login(loginRequest.login, loginRequest.email, loginRequest.password);
    req.session.user = {
        id: user.id,
        role: user.role,
    };
    const response = new LoginResponse(user.id);
    res.json(response);
}

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       204:
 *         description: Logged out successfully
 */
function logout(req, res) {
    req.session.destroy();
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/auth/password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePasswordUpdateIntentRequest'
 *     responses:
 *       204:
 *         description: No content
 */
async function createPasswordUpdateIntent(req, res) {
    const passwordUpdateIntent = new CreatePasswordUpdateIntentRequest(req.body.email, req.body.new_password);
    await authService.createPasswordUpdateIntent(passwordUpdateIntent.email, passwordUpdateIntent.new_password);
    res.sendStatus(204);
}

/**
 * @swagger
 * /api/auth/confirm-password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       204:
 *         description: No content
 */
async function updatePassword(req, res) {
    const updatePasswordRequest = new UpdatePasswordRequest(req.body.email, req.body.confirm_token);
    await authService.updatePassword(updatePasswordRequest.email, updatePasswordRequest.confirm_token);
    res.sendStatus(204);
}

module.exports = { register, confirmRegistration, login, logout, createPasswordUpdateIntent, updatePassword };
