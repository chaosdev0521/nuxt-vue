interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
}

export const useToast = () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { ...toast, id }
    toasts.value.push(newToast)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, description?: string) => {
    return addToast({ type: 'success', title, description })
  }

  const error = (title: string, description?: string) => {
    return addToast({ type: 'error', title, description })
  }

  const info = (title: string, description?: string) => {
    return addToast({ type: 'info', title, description })
  }

  const warning = (title: string, description?: string) => {
    return addToast({ type: 'warning', title, description })
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    return addToast({ type, title: message })
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    showToast
  }
}
