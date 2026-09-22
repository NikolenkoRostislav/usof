import { api } from './api.js';

export function roll() {
    return api.post(`/gacha/roll`);
}

export function getStatus() {
    return api.get(`/gacha/status`);
}
