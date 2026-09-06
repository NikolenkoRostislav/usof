const userService = require("./service");
const { CreateUserRequest, UpdateUserRequest } = require("./requests");
const { UserResponse, UserFullResponse, UsersListResponse } = require("./responses");

async function getById(req, res) {
    const { user_id } = req.params;
    const user = await userService.getById(user_id);
    const response = new UserResponse(user);
    res.json(response);
}

async function getSelf(req, res) {
    const userId = req.session.user.id;
    const user = await userService.getById(userId);
    const response = new UserFullResponse(user);
    res.json(response);
}

async function getAll(req, res) {
    const users = await userService.getAll();
    const response = new UsersListResponse(users);
    res.json(response);
}

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

async function update(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;
    const updateRequest = new UpdateUserRequest(req.body);

    const user = await userService.update(user_id, requestingUserId, requestingUserRole, updateRequest);
    const response = new UserResponse(user);
    res.json(response);
}

async function deleteUser(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;

    await userService.deleteUser(user_id, requestingUserId, requestingUserRole);
    res.sendStatus(204);
}

module.exports = { getById, getSelf, getAll, create, update, deleteUser };