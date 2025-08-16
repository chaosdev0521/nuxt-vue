<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <svg class="animate-spin h-full w-full" fill="none" viewBox="0 0 24 24">
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="4"
        />
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    
    <p v-if="message" :class="messageClass">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  overlay?: boolean
  color?: 'blue' | 'white' | 'gray' | 'green'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  overlay: false,
  color: 'blue'
})

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const colorClasses = {
  blue: 'text-blue-600',
  white: 'text-white',
  gray: 'text-gray-600 dark:text-gray-400',
  green: 'text-green-600'
}

const containerClass = computed(() => {
  if (props.overlay) {
    return 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  }
  return 'flex flex-col items-center justify-center'
})

const spinnerClass = computed(() => [
  sizeClasses[props.size],
  colorClasses[props.color]
])

const messageClass = computed(() => [
  'mt-3 text-sm font-medium',
  props.overlay ? 'text-white' : 'text-gray-900 dark:text-white'
])
</script>
