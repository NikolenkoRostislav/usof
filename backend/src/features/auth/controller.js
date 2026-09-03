const authService = require("./service");

async function register(req, res) {
    const { login, password, password_confirmation, email, fullName } = req.body;
    if (password !== password_confirmation) {
        return res.status(422).json({ message: "Passwords do not match" });
    }

    await authService.register({ login, password, email, fullName });
    res.status(201).json({ message: "Registration successful. Check your email to confirm." });
}

async function confirmRegistration(req, res) {
    const { email } = req.body;
    const { confirm_token } = req.params;
    const user = await authService.confirmRegistration(email, confirm_token);
    req.session.user = {
        id: user.id,
        role: user.role,
    };
    res.status(200).json({ user_id: user.id });
}

async function login(req, res) {
    const { login, email, password } = req.body;
    const user = await authService.login(login, email, password);
    req.session.user = {
        id: user.id,
        role: user.role,
    };
    res.status(200).json({ user_id: user.id });
}

function logout(req, res) {
    req.session.destroy();
    res.sendStatus(204);
}

module.exports = { register, confirmRegistration, login, logout };
