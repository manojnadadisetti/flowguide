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
      errorDetail = data.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }

  // Parse JSON if response has content
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
