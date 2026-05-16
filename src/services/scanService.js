import axios from 'axios';

const AI_API_URL = import.meta.env.VITE_AI_API_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Scan service — handles image upload for AI prediction.
 * Uses backend as proxy to protect API keys.
 */
const scanService = {
  /**
   * Upload image for accurate classification (yolo26m).
   */
  async predictUpload(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const baseUrl = BACKEND_URL || AI_API_URL;
    const endpoint = BACKEND_URL ? '/api/predict' : '/predict/upload';

    const { data } = await axios.post(`${baseUrl}${endpoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60s for cold start
    });

    return data;
  },

  /**
   * Check AI engine health.
   */
  async checkHealth() {
    try {
      const { data } = await axios.get(`${AI_API_URL}/health`, { timeout: 10000 });
      return { status: 'awake', ...data };
    } catch {
      return { status: 'sleeping' };
    }
  },
};

export default scanService;
