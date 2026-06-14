import { request } from './api';

export const onboardingService = {
  async listSteps() {
    return request('/api/onboarding/steps');
  },

  async getSummary() {
    return request('/api/onboarding/summary');
  },

  async updateProgress(stepId, status, notes = '') {
    return request(`/api/onboarding/steps/${stepId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  async getGuidance(query) {
    return request('/api/onboarding/guidance', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }
};
