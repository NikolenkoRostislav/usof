import { escapeHtml } from './common.js';

export function getCreateFormData() {
    return {
        title: document.getElementById('awardName').value.trim(),
        description: document.getElementById('awardDescription').value.trim(),
        rarity: document.getElementById('awardRarity')?.value || 'common'
    };
}

export function clearCreateForm() {
    document.getElementById('awardName').value = '';
    document.getElementById('awardDescription').value = '';

    const rarity = document.getElementById('awardRarity');

    if (rarity) {
        rarity.value = 'common';
    }
}

export function renderAwards(awards) {
    const container = document.getElementById('awardsList');

    if (awards.length === 0) {
        container.innerHTML = '<div class="no-data">No awards found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Rarity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${awards.map(award => `
                    <tr>
                        <td>${escapeHtml(award.id)}</td>
                        <td>${escapeHtml(award.title)}</td>
                        <td>${escapeHtml(award.description || '')}</td>
                        <td>${escapeHtml(award.rarity || '')}</td>
                        <td class="action-buttons">
                            <button
                                class="btn-small btn-delete"
                                onclick="deleteAward('${award.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function renderAwardsError(message) {
    document.getElementById('awardsList').innerHTML =
        `<div class="error-message">${escapeHtml(message)}</div>`;
}