<template>
  <Teleport to="body">
    <div class="fixed top-20 right-4 z-50 space-y-3 w-80">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="getToastClasses(toast.type)"
          class="relative flex items-start p-4 rounded-2xl shadow-2xl border backdrop-blur-md transform transition-all duration-300"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mr-3">
            <component :is="getIcon(toast.type)" class="w-5 h-5" />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold mb-1">{{ toast.title }}</h4>
            <p v-if="toast.description" class="text-xs opacity-90 leading-relaxed">
              {{ toast.description }}
            </p>
          </div>
          
          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 ml-2 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 group"
          >
            <svg class="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Progress Bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-2xl">
            <div class="h-full bg-current opacity-60 rounded-b-2xl animate-progress"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, removeToast } = useToast()

const getToastClasses = (type) => {
  const classes = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700/50 dark:text-green-200',
    error: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50 text-red-800 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700/50 dark:text-red-200', 
    warning: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50 text-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700/50 dark:text-yellow-200',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 text-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50 dark:text-blue-200'
  }
  return classes[type] || classes.info
}

const getIcon = (type) => {
  return h('svg', {
    class: 'w-5 h-5',
    fill: 'currentColor',
    viewBox: '0 0 20 20'
  }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: type === 'success' 
        ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
        : type === 'error'
        ? 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
        : type === 'warning'
        ? 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
        : 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
      'clip-rule': 'evenodd'
    })
  ])
}
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Progress bar animation */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress 5s linear forwards;
}
</style>
