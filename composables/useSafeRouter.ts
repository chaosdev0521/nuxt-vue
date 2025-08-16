export const useSafeRouter = () => {
  let router: any = null
  let isReady = ref(false)

  const initRouter = async () => {
    if (process.client && !router) {
      try {
        // Wait for the next tick to ensure router is available
        await nextTick()
        router = useRouter()
        isReady.value = true
      } catch (error) {
        // Router initialization error
        isReady.value = false
      }
    }
  }

  const push = async (route: string) => {
    if (!isReady.value) {
      await initRouter()
    }
    
    if (router && isReady.value) {
      try {
        await router.push(route)
      } catch (error) {
        // Router push error
        // Fallback navigation
        window.location.href = route
      }
    } else {
      // Fallback navigation
      window.location.href = route
    }
  }

  const replace = async (route: string) => {
    if (!isReady.value) {
      await initRouter()
    }
    
    if (router && isReady.value) {
      try {
        await router.replace(route)
      } catch (error) {
        // Router replace error
        // Fallback navigation
        window.location.href = route
      }
    } else {
      // Fallback navigation
      window.location.href = route
    }
  }

  const back = () => {
    if (router && isReady.value) {
      try {
        router.back()
      } catch (error) {
        // Router back error
        // Fallback navigation
        window.history.back()
      }
    } else {
      // Fallback navigation
      window.history.back()
    }
  }

  // Initialize router on mount
  onMounted(() => {
    initRouter()
  })

  return {
    router: readonly(router),
    isReady: readonly(isReady),
    push,
    replace,
    back,
    initRouter
  }
} 