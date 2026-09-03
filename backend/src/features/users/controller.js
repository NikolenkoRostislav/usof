const userService = require("./service");

async function getById(req, res) {
    const { userId } = req.params;
    const user = await userService.getById(userId);
    res.json(user); //todo: make user response DTO without password and other sensitive data
}

async function getSelf(req, res) {
    const userId = req.session.user.id;
    const user = await userService.getById(userId);
    res.json(user); //todo: make user response DTO without password
}

module.exports = { getById, getSelf };