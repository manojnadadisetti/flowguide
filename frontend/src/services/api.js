/**
 * FlowGuide - API Service Client wrapper
 */

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const data = await response.json();
      if (data && data.detail) {
        if (typeof data.detail === 'string') {
          errorDetail = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Format list of FastAPI validation errors: e.g., 'body.email: value is not a valid email'
          errorDetail = data.detail.map(err => {
            const loc = err.loc ? err.loc.join('.') : '';
            return loc ? `${loc}: ${err.msg}` : err.msg;
          }).join(', ');
        } else if (typeof data.detail === 'object') {
          errorDetail = data.detail.message || data.detail.error || JSON.stringify(data.detail);
        }
      } else if (data && data.message) {
        errorDetail = data.message;
      } else if (data && data.error) {
        errorDetail = data.error;
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }

  // Parse JSON if response has content
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
