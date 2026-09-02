const authService = require("./service");

async function register(req, res) {
    const { login, password, email, fullName } = req.body;
    await authService.register({ login, password, email, fullName });
    res.status(201).json({ message: "Registration successful. Check your email to confirm." });
}

async function confirmRegistration(req, res) {
    const { email } = req.body;
    const { confirm_token } = req.params;
    await authService.confirmRegistration(email, confirm_token);
    res.status(200).json({ message: "Registration confirmed successfully." });
}

async function login(req, res) {
    const { login, password } = req.body;
    await authService.login(login, password);
    res.status(200).json({ message: "Login successful." });
}

module.exports = { register, confirmRegistration, login };
