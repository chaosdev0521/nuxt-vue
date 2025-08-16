<template>
  <div>
    <!-- Show modals when user is not authenticated -->
    <div v-if="!authStore.isAuthenticated" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <!-- Floating Navigation -->
      <nav class="absolute top-0 left-0 right-0 z-10 p-6">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-800 dark:text-white">FinanceFlow</span>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <a href="#" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <!-- Hero Section -->
        <div class="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
          <div class="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 mb-8 animate-fade-in-scale" style="animation-delay: 0.2s;">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Trusted by 10,000+ users</span>
          </div>
          
          <h1 class="text-responsive-xl font-bold gradient-text mb-6 leading-tight animate-fade-in-scale" style="animation-delay: 0.4s;">
            Master Your
            <span class="block">Finances</span>
          </h1>
          
          <p class="text-responsive-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-scale" style="animation-delay: 0.6s;">
            The ultimate personal finance dashboard that helps you track, analyze, and grow your wealth with beautiful insights and powerful tools.
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-20 animate-fade-in-scale" style="animation-delay: 0.8s;">
          <button 
            @click="showLoginModal = true"
            class="btn-primary group relative px-8 py-4"
          >
            <span class="relative z-10 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Get Started
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            @click="showRegisterModal = true"
            class="btn-secondary group relative px-8 py-4"
          >
            <span class="relative z-10">Create Account</span>
            <div class="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
          <div class="group relative animate-fade-in-scale" style="animation-delay: 0.2s;">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div class="relative p-8 glass rounded-3xl card-hover">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Tracking</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">Automatically categorize and track every transaction with AI-powered insights and real-time updates.</p>
            </div>
          </div>
          
          <div class="group relative animate-fade-in-scale" style="animation-delay: 0.4s;">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div class="relative p-8 glass rounded-3xl card-hover">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Advanced Analytics</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">Get deep insights into your spending patterns with beautiful charts and predictive financial planning.</p>
            </div>
          </div>
          
          <div class="group relative animate-fade-in-scale" style="animation-delay: 0.6s;">
            <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div class="relative p-8 glass rounded-3xl card-hover">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Bank-Level Security</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">Your financial data is protected with enterprise-grade encryption and secure authentication.</p>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mb-16 animate-fade-in-scale" style="animation-delay: 1s;">
          <div class="text-center group">
            <div class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
            <div class="text-slate-600 dark:text-slate-400 text-sm">Active Users</div>
          </div>
          <div class="text-center group">
            <div class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">$2M+</div>
            <div class="text-slate-600 dark:text-slate-400 text-sm">Tracked Assets</div>
          </div>
          <div class="text-center group">
            <div class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
            <div class="text-slate-600 dark:text-slate-400 text-sm">Uptime</div>
          </div>
          <div class="text-center group">
            <div class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div class="text-slate-600 dark:text-slate-400 text-sm">Support</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© 2024 FinanceFlow. All rights reserved.</p>
        </div>
      </div>

      <!-- Login Modal -->
      <LoginModal
        :show="showLoginModal"
        :form="loginForm"
        :loading="loginLoading"
        @close="showLoginModal = false"
        @login="handleLogin"
        @update:form="loginForm = $event"
        @switch-to-register="switchToRegister"
      />

      <!-- Register Modal -->
      <RegisterModal
        :show="showRegisterModal"
        :form="registerForm"
        :loading="registerLoading"
        @close="showRegisterModal = false"
        @register="handleRegister"
        @error="handleRegisterError"
        @update:form="registerForm = $event"
        @switch-to-login="switchToLogin"
      />

      <!-- Toast Container -->
      <ToastContainer />
    </div>

    <!-- Show dashboard content when user is authenticated -->
    <div v-else>
      <DashboardView 
        :user="authStore.user" 
        :is-manager="authStore.isManager"
        @navigate="handleNavigation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const authStore = useAuthStore()
const { showToast } = useToast()
const { push: safePush } = useSafeRouter()
const { initTheme } = useTheme()

// Initialize theme and redirect to login if not authenticated
onMounted(async () => {
  initTheme()
  authStore.loadFromStorage()
  if (!authStore.isAuthenticated) {
    await safePush('/login')
  }
})

// Modal state
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// Form data
const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Loading states
const loginLoading = ref(false)
const registerLoading = ref(false)

const handleNavigation = async (route: string) => {
  if (!authStore.isAuthenticated) {
    showToast('Please log in to access this feature', 'info')
    return
  }
  
  await safePush(`/${route}`)
}

// Handle login
const handleLogin = async () => {
  loginLoading.value = true
  
  try {
    const result = await authStore.login(loginForm.value.email, loginForm.value.password)
    if (result.success) {
      showLoginModal.value = false
      loginForm.value = { email: '', password: '' }
      showToast('Login successful!', 'success')
    } else {
      showToast(result.message, 'error')
    }
  } catch (error) {
    showToast('Login failed', 'error')
  } finally {
    loginLoading.value = false
  }
}

// Handle register
const handleRegister = async (formData) => {
  registerLoading.value = true
  
  try {
    const result = await authStore.register(formData.email, formData.password)
    if (result.success) {
      showRegisterModal.value = false
      registerForm.value = { email: '', password: '', confirmPassword: '' }
      showToast('Registration successful! Please log in.', 'success')
    } else {
      showToast(result.message, 'error')
    }
  } catch (error) {
    showToast('Registration failed', 'error')
  } finally {
    registerLoading.value = false
  }
}

// Handle register validation errors
const handleRegisterError = (error) => {
  showToast(error, 'error')
}

// Modal switching functions
const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}
</script>
