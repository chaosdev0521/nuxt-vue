<template>
  <div v-if="!authStore.isAuthenticated" class="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Gradient Orbs -->
      <div class="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <!-- Geometric Shapes -->
      <div class="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
      <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-ping"></div>
      <div class="absolute bottom-1/4 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-bounce"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-30">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <g fill="#9C92AC" fill-opacity="0.05">
                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto pb-10">
        <!-- Hero Section -->
        <div class="text-center mb-10 p-5">
          <!-- Main Heading -->
          <h1 class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 mb-6 animate-fade-in-up animation-delay-200">
            FinanceFlow
          </h1>
          
          <!-- Subheading -->
          <p class="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Transform your financial management with our 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">intelligent</span> 
            transaction platform
          </p>
          
          <!-- Feature Pills -->
          <div class="flex flex-wrap justify-center gap-3 mt-8 mb-12 animate-fade-in-up animation-delay-600">
            <span class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white">
              🚀 Real-time Analytics
            </span>
            <span class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white">
              🔒 Bank-level Security
            </span>
            <span class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white">
              📱 Mobile Optimized
            </span>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in-up animation-delay-800">
            <button 
              class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span class="relative z-10 flex items-center justify-center">
                Get Started Free
                <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H7"></path>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
              class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl shadow-xl hover:bg-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Enterprise
            </button>
          </div>
        </div>
        
        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animation-delay-1000">
          <div class="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Smart Analytics</h3>
            <p class="text-slate-400 leading-relaxed">Get insights into your spending patterns with advanced analytics and beautiful visualizations.</p>
          </div>
          
          <div class="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Secure & Private</h3>
            <p class="text-slate-400 leading-relaxed">Your financial data is protected with enterprise-grade encryption and security measures.</p>
          </div>
          
          <div class="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p class="text-slate-400 leading-relaxed">Experience blazing fast performance with real-time updates and instant synchronization.</p>
          </div>
        </div>
        
        <!-- Status Indicators -->
        <div class="flex justify-center space-x-6 animate-fade-in-up animation-delay-1200">
          <div class="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-green-300 text-sm font-medium">Frontend: Connected</span>
          </div>
          <div class="flex items-center space-x-2 px-4 py-2 border rounded-full" :class="getApiStatusClass()">
            <div class="w-2 h-2 rounded-full animate-pulse" :class="getApiStatusDotClass()"></div>
            <span class="text-sm font-medium" :class="getApiStatusTextClass()">{{ apiStatusText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <!-- Redirect to dashboard if authenticated -->
    <div class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <h2 class="text-xl font-semibold mb-2">Redirecting to Dashboard...</h2>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()
const apiStatus = ref('🔄 Checking API...')

// Test API connection with better error handling
const testAPI = async () => {
  try {
    const response = await $fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      body: { email: 'test', password: 'test' },
      timeout: 3000
    })
    apiStatus.value = '✅ API: Connected'
  } catch (error) {
    if (error?.statusCode === 401) {
      apiStatus.value = '✅ API: Connected (authentication working)'
    } else {
      apiStatus.value = '❌ API: Connection failed - Please start the API server'
    }
  }
}

const goToRegister = () => {
  try {
    router.push('/register')
  } catch (error) {
    // Navigation error
  }
}

const goToLogin = () => {
  try {
    router.push('/login')
  } catch (error) {
    // Navigation error
  }
}

const { initTheme } = useTheme()

// Initialize theme and redirect based on auth status
onMounted(async () => {
  initTheme()
  authStore.loadFromStorage()
  
  if (authStore.isAuthenticated) {
    await router.push('/dashboard')
  } else {
    await router.push('/login')
  }
})
</script>

<style>
/* Custom Animations */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1200 {
  animation-delay: 1.2s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.7);
}
</style>
