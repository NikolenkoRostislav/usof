import * as awardModel from '../models/award.js';
import * as awardView from '../views/award.js';
import { showMessage } from '../views/common.js';

export async function loadAwards() {
    try {
        const awards = await awardModel.getAwards();

        awardView.renderAwards(awards);
    } catch (error) {
        awardView.renderAwardsError(error.message);
    }
}

export async function createAward() {
    const {
        title,
        description,
        rarity
    } = awardView.getCreateFormData();

    if (!title) {
        alert('Award title is required');
        return;
    }

    try {
        await awardModel.createAward(
            title,
            description,
            rarity
        );

        awardView.clearCreateForm();

        showMessage(
            'awardsSuccess',
            'Award created successfully'
        );

        await loadAwards();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export async function deleteAward(awardId) {
    if (!confirm('Are you sure?')) {
        return;
    }

    try {
        await awardModel.deleteAward(awardId);

        showMessage(
            'awardsSuccess',
            'Award deleted successfully'
        );

        await loadAwards();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}