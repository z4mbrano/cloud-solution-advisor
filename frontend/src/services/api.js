import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const chatAPI = {
  async sendMessage(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  async getHistory() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },

  async clearHistory() {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clear`);
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw error;
    }
  }
};
