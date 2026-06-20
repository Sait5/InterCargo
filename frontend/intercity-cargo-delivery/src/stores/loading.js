import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingText: 'Загрузка...'
  }),

  actions: {
    startLoading(text = 'Загрузка...') {
      this.isLoading = true
      this.loadingText = text
    },
    
    stopLoading() {
      this.isLoading = false
    },
    
    async withLoading(action, text = 'Загрузка...') {
      this.startLoading(text);
      try {
        return await action();
      } finally {
        this.stopLoading();
      }
    }
  }
})