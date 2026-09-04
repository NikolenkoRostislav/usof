const userService = require("./service");

async function getById(req, res) {
    const { user_id } = req.params;
    const user = await userService.getById(user_id);
    res.json(user);
}

async function getSelf(req, res) {
    const userId = req.session.user.id;
    const user = await userService.getById(userId);
    res.json(user);
}

async function getAll(req, res) {
    const users = await userService.getAll();
    res.json(users);
}

async function create(req, res) {
    const { login, email, password, fullName, role } = req.body;
    const user = await userService.create(login, email, password, fullName, role);
    res.status(201).json(user);
}

async function update(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;
    const updates = req.body;

    const user = await userService.update(user_id, requestingUserId, requestingUserRole, updates);
    res.json(user);
}

async function deleteUser(req, res) {
    const { user_id } = req.params;
    const requestingUserId = req.session.user.id;
    const requestingUserRole = req.session.user.role;

    await userService.deleteUser(user_id, requestingUserId, requestingUserRole);
    res.sendStatus(204);
}

module.exports = { getById, getSelf, getAll, create, update, deleteUser };