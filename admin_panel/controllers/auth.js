import * as authModel from '../models/auth.js';
import * as authView from '../views/auth.js';

export async function initialize() {
    const isLoggedIn = await authModel.checkSession();

    if (isLoggedIn) {
        authView.showDashboard();
        return true;
    }

    authView.showLoginPage();
    return false;
}

export async function login() {
    const { username, password } = authView.getLoginFormData();

    try {
        await authModel.login(username, password);

        const isLoggedIn = await authModel.checkSession();
        if (isLoggedIn) {
            authView.resetLoginForm();
            authView.clearLoginError();
            authView.showDashboard();
            return true;
        }

        throw Error;
    } catch (error) {
        authView.showLoginError(
            'Invalid credentials or not an admin'
        );
        authView.resetLoginForm();

        return false;
    }
}

export async function logout() {
    try {
        await authModel.logout();
    } catch (error) {
        console.error('Logout failed:', error);
    }

    authView.resetLoginForm();
    authView.clearLoginError();
    authView.showLoginPage();
}