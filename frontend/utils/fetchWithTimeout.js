/**
 * Fetch with timeout and abort controller
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>} - The fetch response
 */
export function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions = {
    ...options,
    signal: controller.signal,
  };

  return fetch(url, fetchOptions)
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

/**
 * Safe fetch with error handling and timeout
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function safeFetch(url, options = {}, timeout = 10000) {
  try {
    const response = await fetchWithTimeout(url, options, timeout);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
}

/**
 * Fetch multiple URLs in parallel with timeout
 * @param {Array<{url: string, options?: Object, timeout?: number}>} requests - Array of request configs
 * @returns {Promise<Array<{success: boolean, data?: any, error?: string}>>}
 */
export async function fetchMultiple(requests) {
  const promises = requests.map(({ url, options = {}, timeout = 10000 }) => 
    safeFetch(url, options, timeout)
  );
  
  return Promise.all(promises);
}
