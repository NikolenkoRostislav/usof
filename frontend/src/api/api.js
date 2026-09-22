const API_URL = 'http://localhost:3000/api';

async function request(url, options = {}) {
    const response = await fetch(`${API_URL}${url}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        // Some endpoints may return no body.
    }

    if (!response.ok) {
        const message = data?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return data;
}

export const api = {
    get: (url) => request(url),

    post: (url, body) => request(url, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    patch: (url, body) => request(url, {
        method: 'PATCH',
        body: JSON.stringify(body)
    }),

    delete: (url) => request(url, {
        method: 'DELETE'
    }),

    getBlob: async (url) => {
        const response = await fetch(`${API_URL}${url}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.blob();
    }
};