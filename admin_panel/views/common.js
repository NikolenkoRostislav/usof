export function showMessage(elementId, message) {
    const element = document.getElementById(elementId);

    element.textContent = message;
    element.style.display = 'block';

    setTimeout(() => { element.style.display = 'none'; }, 3000);
}

export function escapeHtml(value) {
    if (typeof value !== 'string') {
        value = String(value);
    }

    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function switchTab(tabName) {
    document
        .querySelectorAll('.tab-content')
        .forEach(tab => tab.classList.remove('active'));

    document
        .querySelectorAll('.tab-btn')
        .forEach(button => button.classList.remove('active'));

    document
        .getElementById(tabName)
        .classList.add('active');

    document
        .querySelector(`[onclick="switchTab('${tabName}')"]`)
        .classList.add('active');
}

export function setupModalClose(modalId, closeFunction) {
    window.addEventListener('click', event => {
        const modal = document.getElementById(modalId);

        if (event.target === modal) {
            closeFunction();
        }
    });
}