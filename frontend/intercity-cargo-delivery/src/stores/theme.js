// stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  // State - данные
  state: () => ({
    isDark: true
  }),

  // Getters - вычисляемые значения (как computed)
  getters: {
    themeName: (state) => state.isDark ? 'Темная' : 'Светлая',
    currentTheme: (state) => state.isDark ? 'dark' : 'light'
  },

  // Actions - методы для изменения state
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      const theme = this.currentTheme
      
      // Сохраняем в DOM и localStorage
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    },
    
    initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      this.isDark = savedTheme === 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
})