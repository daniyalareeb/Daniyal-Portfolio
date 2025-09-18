

/**
 * DanPortfolio Frontend - API Client Module
 * 
 * This module provides a centralized API client for communicating with the backend.
 * It handles authentication, error handling, timeouts, and request/response processing.
 * 
 * Key Features:
 * - Automatic cookie handling for authentication
 * - Request timeout management with AbortController
 * - Comprehensive error handling and user-friendly messages
 * - JSON request/response processing
 * - Specialized methods for different API endpoints
 * 
 * Security Features:
 * - Credentials included for session management
 * - Proper error handling without exposing sensitive information
 * - Timeout protection against hanging requests
 * 
 * Author: Daniyal Ahmad
 * Repository: https://github.com/daniyalareeb/portfolio
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';

/**
 * Centralized API client for backend communication
 * 
 * Provides methods for making HTTP requests with proper error handling,
 * authentication, and timeout management.
 */
export const ApiClient = {
  /**
   * Generic request method with timeout and error handling
   * 
   * @param {string} path - API endpoint path
   * @param {Object} options - Fetch options (method, body, headers, etc.)
   * @returns {Promise<Object>} API response data
   * @throws {Error} Request timeout or API error
   */
  async request(path, options = {}) {
    const url = `${API_URL}${path}`;
    
    // Set up timeout and abort controller for request cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const res = await fetch(url, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(options.headers || {}) 
        },
        credentials: 'include', // Include cookies for authentication
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      let body = null;
      try { 
        body = await res.json(); 
      } catch (e) {
        // Handle non-JSON responses gracefully
        if (!res.ok) {
          throw new Error(`API request failed: ${res.status} ${res.statusText}`);
        }
      }
      
      if (!res.ok) {
        const msg = body?.error || `API request failed: ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }
      
      return body;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  },
  /**
   * Convenience method for POST requests
   * @param {string} path - API endpoint path
   * @param {Object} json - Request body data
   * @returns {Promise<Object>} API response
   */
  post: (path, json) => ApiClient.request(path, { method: "POST", body: JSON.stringify(json) }),
  
  /**
   * Convenience method for GET requests
   * @param {string} path - API endpoint path
   * @returns {Promise<Object>} API response
   */
  get: (path) => ApiClient.request(path),

  /**
   * Send message to AI chat system with extended timeout
   * 
   * Uses a longer timeout (35s) since AI processing can take significant time.
   * Provides specialized error handling for chat-specific issues.
   * 
   * @param {string} message - User message to send to AI
   * @param {string} mode - Chat mode ("home", "cv", etc.)
   * @returns {Promise<Object>} AI response with answer and sources
   * @throws {Error} Chat timeout or API error
   */
  async sendChatMessage(message, mode = "home") {
    // Use longer timeout for chat requests (AI can take up to 30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for chat
    
    try {
      const url = `${API_URL}/api/v1/chat/send`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({ message, mode })
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Chat request failed: ${res.status} ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Chat request timeout - the AI is taking longer than expected. Please try again.');
      }
      throw error;
    }
  },

  /**
   * Submit contact form data
   * 
   * @param {string} name - Contact person's name
   * @param {string} email - Contact person's email
   * @param {string} message - Contact message
   * @returns {Promise<Object>} Submission confirmation
   */
  async submitContact(name, email, message) {
    return this.post('/api/v1/contact/submit', { name, email, message });
  },

  /**
   * Get list of projects
   * 
   * @returns {Promise<Object>} List of projects with details
   */
  async getProjects() {
    return this.get('/api/v1/projects/list');
  },

  /**
   * Get list of AI tools with optional filtering
   * 
   * @param {string} query - Search query for tool names/descriptions
   * @param {string} category - Filter by tool category
   * @param {number} limit - Maximum number of tools to return
   * @returns {Promise<Object>} List of tools matching criteria
   */
  async getTools(query, category, limit = 20) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit);
    
    return this.get(`/api/v1/tools/list?${params.toString()}`);
  },

  /**
   * Get list of blog posts/news articles
   * 
   * @returns {Promise<Object>} List of blog posts
   */
  async getNews() {
    return this.get('/api/v1/news/list');
  },

  /**
   * Query CV data with a specific question
   * 
   * @param {string} question - Question to ask about CV data
   * @returns {Promise<Object>} AI-generated answer based on CV
   */
  async queryCV(question) {
    return this.post('/api/v1/cv/query', { question });
  }
};
