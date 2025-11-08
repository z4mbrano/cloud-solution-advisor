import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const chatAPI = {
  async sendMessage(message, botId = 'querrybot', chatId = 'default') {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: message,
        bot_id: botId,
        chat_id: chatId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  async getChatHistory(chatId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico do chat:', error);
      throw error;
    }
  },

  async getAllHistory() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },

  async clearChatHistory(chatId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clear/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar histórico do chat:', error);
      throw error;
    }
  },

  async clearAllHistory() {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clear`);
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw error;
    }
  },

  async getBots() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bots`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      throw error;
    }
  }
};
