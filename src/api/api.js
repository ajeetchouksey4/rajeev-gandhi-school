// Centralized API utility
// All API calls go through this module so the base URL is defined in one place.

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (isLocal ? 'http://localhost:8080/api' : 'https://rajeev-gandhi-school-backend-production-4574.up.railway.app/api')

// Automatically append /api if it's missing from the configured environment variables
if (rawBaseUrl && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
    rawBaseUrl = rawBaseUrl.endsWith('/') ? `${rawBaseUrl}api` : `${rawBaseUrl}/api`
}

const BASE_URL = rawBaseUrl

/**
 * Generic fetch wrapper.
 * @param {string} endpoint - API path like '/enquiries'
 * @param {object} options  - fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`

    const defaultHeaders = {
        'Content-Type': 'application/json',
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    }

    // Automatically stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    return response
}

const api = {
    /**
     * GET request
     * @param {string} endpoint - e.g. '/enquiries'
     * @param {object} options  - optional fetch overrides
     */
    get: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'GET' }),

    /**
     * POST request
     * @param {string} endpoint - e.g. '/enquiries'
     * @param {object} data     - request body (will be JSON-stringified)
     * @param {object} options  - optional fetch overrides
     */
    post: (endpoint, data, options = {}) =>
        request(endpoint, { ...options, method: 'POST', body: data }),

    /**
     * PUT request
     * @param {string} endpoint - e.g. '/enquiries/1'
     * @param {object} data     - request body
     * @param {object} options  - optional fetch overrides
     */
    put: (endpoint, data, options = {}) =>
        request(endpoint, { ...options, method: 'PUT', body: data }),

    /**
     * DELETE request
     * @param {string} endpoint - e.g. '/enquiries/1'
     * @param {object} options  - optional fetch overrides
     */
    delete: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'DELETE' }),
}

export default api
