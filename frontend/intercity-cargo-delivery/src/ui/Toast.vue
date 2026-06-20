<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="toastStore.remove(toast.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 420px;
  padding: 16px 20px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}
.toast.success {
  background: rgba(45, 192, 113, 0.15);
  border-color: rgba(45, 192, 113, 0.3);
}
.toast.error {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}
.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast.success .toast-icon {
  color: #2DC071;
}
.toast.error .toast-icon {
  color: #ef4444;
}
.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.4;
}
.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.toast-close svg {
  width: 18px;
  height: 18px;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (max-width: 768px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
  }
  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>