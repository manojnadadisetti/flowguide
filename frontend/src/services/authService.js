import { request } from './api';

export const authService = {
  async login(email, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Stores tokens
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    }
    return data;
  },

  async register(email, password, fullName, phoneNumber) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName, phone_number: phoneNumber }),
    });
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token') || '';
    try {
      await request('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (e) {
      console.warn('Backend logout failed/skipped:', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  async getProfile() {
    return request('/api/users/me');
  },

  async updateProfile(fullName, avatarUrl, phoneNumber) {
    return request('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl, phone_number: phoneNumber }),
    });
  }
};
