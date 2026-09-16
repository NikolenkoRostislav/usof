import { api } from './api.js';

export async function getAwards() {
    const data = await api.get('/awards');
    return data.awards || [];
}

export function createAward(title, description, rarity) {
    return api.post('/awards', {
        title,
        description,
        rarity
    });
}

export function deleteAward(id) {
    return api.delete(`/awards/${id}`);
}