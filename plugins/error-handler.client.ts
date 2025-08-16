export default defineNuxtPlugin(() => {
  if (process.client) {
    // Handle Chrome extension connection errors specifically
    const originalConsoleError = console.error
    console.error = function(...args) {
      const message = args[0]?.toString() || ''
      
      // Filter out Chrome extension errors
      if (message.includes('Could not establish connection') ||
          message.includes('Receiving end does not exist') ||
          message.includes('runtime.lastError')) {
        // These are browser extension errors, not our app errors
        console.warn('🔌 Browser extension message (safe to ignore):', ...args)
        return
      }
      
      // Allow other errors to be logged normally
      originalConsoleError.apply(console, args)
    }

    // Handle uncaught promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || event.reason?.toString() || ''
      
      if (message.includes('Could not establish connection') ||
          message.includes('Receiving end does not exist')) {
        console.warn('🔌 Browser extension rejection (safe to ignore):', event.reason)
        event.preventDefault()
        return
      }
      
      console.warn('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    })

    // Handle general errors
    window.addEventListener('error', (event) => {
      const message = event.message || ''
      
      if (message.includes('Could not establish connection') ||
          message.includes('Receiving end does not exist')) {
        console.warn('🔌 Browser extension error (safe to ignore):', event.error)
        event.preventDefault()
        return
      }
      
      console.warn('Uncaught error:', event.error)
    })
    
    // Add a note about extension errors
    console.info('🔌 Chrome extension connection warnings are filtered and safe to ignore.')
  }
})
