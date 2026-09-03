const RegistrationIntent = require("../../domain/entities/registration_intent");
const User = require("../../domain/entities/user");
const EmailSender = require("../../infra/email_sender/dev");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

const frontedUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const registrationTokenExpirationMinutes = 10;

async function register({ login, password, email, fullName = null }) {
    return await transactional(_register)(login, password, email, fullName);
}

async function _register(uow, login, password, email, fullName = null) {
    const registrationIntentsRepo = uow.registrationIntents();
    const usersRepo = uow.users();

    const existingUserByLogin = await usersRepo.findByLogin(login);
    if (existingUserByLogin) {
        throw new AppError(Kind.Conflict, "Login already exists");
    }

    const existingUserByEmail = await usersRepo.findByEmail(email);
    if (existingUserByEmail) {
        throw new AppError(Kind.Conflict, "Email already exists");
    }

    registration = new RegistrationIntent({ login, email, fullName });
    registration.setPassword(password);
    token = await registration.generateToken();
    await registrationIntentsRepo.save(registration);
    await new EmailSender().sendEmail(
        registration.email,
        "Confirm your registration",
        `Please confirm your registration by clicking the following link: ${frontedUrl}/confirm-registration?token=${token}
        It will only be active for 10 minutes. If you did not request this, please ignore this email.`
    );
}

async function _confirmRegistration(uow, email, token) {
    const registrationIntentsRepo = uow.registrationIntents();
    const usersRepo = uow.users();

    const intent = await registrationIntentsRepo.findByEmail(email);
    if (!intent) {
        throw new AppError(Kind.InvalidEntry, "Invalid token");
    }

    const isTokenValid = await intent.verify(token);
    if (!isTokenValid) {
        throw new AppError(Kind.InvalidEntry, "Invalid token");
    }

    const now = new Date();
    const minutesElapsed = (now - intent.createdAt) / 1000 / 60;
    if (minutesElapsed > registrationTokenExpirationMinutes) {
        throw new AppError(Kind.InvalidEntry, "Token expired");
    }

    const user = new User({
        login: intent.login,
        passwordHash: intent.passwordHash,
        email: intent.email,
        fullName: intent.fullName
    });

    await usersRepo.save(user);
    await registrationIntentsRepo.delete(intent.id);

    return user;
}

async function confirmRegistration(email, token) {
    return await transactional(_confirmRegistration)(email, token);
}

async function _login(uow, login, password) {
    const usersRepo = uow.users();

    const user = await usersRepo.findByLogin(login);
    if (!user) {
        throw new AppError(Kind.Unauthorized, "Invalid login or password");
    }

    if (!await user.checkPassword(password)) {
        throw new AppError(Kind.Unauthorized, "Invalid login or password");
    }

    return user;
}

async function login(login, password) {
    return await transactional(_login)(login, password);
}

module.exports = { register, confirmRegistration, login };