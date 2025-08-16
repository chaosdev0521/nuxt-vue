<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-md" @click="$emit('close')"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
          <!-- Decorative Elements -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <!-- Header -->
          <div class="relative px-8 pt-8 pb-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Join FinanceFlow</h2>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Create your account today</p>
                </div>
              </div>
              <button 
                @click="$emit('close')" 
                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 group"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="relative px-8 pb-8">
            <div class="space-y-6">
              <!-- Email Field -->
              <div class="group">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                  </div>
                  <input 
                    :value="form?.email || ''" 
                    @input="$emit('update:form', { ...form, email: $event.target.value })"
                    type="email" 
                    required 
                    placeholder="Enter your email"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  >
                </div>
              </div>
              
              <!-- Password Field -->
              <div class="group">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input 
                    :value="form?.password || ''" 
                    @input="$emit('update:form', { ...form, password: $event.target.value })"
                    type="password" 
                    required 
                    minlength="6"
                    placeholder="Create a strong password (min 6 chars)"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  >
                </div>
              </div>
              
              <!-- Confirm Password Field -->
              <div class="group">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <input 
                    :value="form?.confirmPassword || ''" 
                    @input="$emit('update:form', { ...form, confirmPassword: $event.target.value })"
                    type="password" 
                    required 
                    placeholder="Confirm your password"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  >
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start space-x-3">
                <div class="flex items-center h-5">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    required
                    class="w-4 h-4 text-purple-600 bg-slate-100 border-slate-300 rounded focus:ring-purple-500 focus:ring-2"
                  >
                </div>
                <label for="terms" class="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the 
                  <a href="#" class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                    Terms of Service
                  </a> 
                  and 
                  <a href="#" class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <!-- Actions -->
              <div class="space-y-4 pt-4">
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span v-if="!loading" class="relative z-10 flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Create Account
                  </span>
                  <div v-else class="relative z-10 flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button 
                  type="button" 
                  @click="$emit('close')" 
                  class="w-full px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>

              <!-- Divider -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Already have an account?</span>
                </div>
              </div>

              <!-- Sign In Link -->
              <div class="text-center">
                <button 
                  type="button"
                  @click="$emit('switch-to-login')"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  Sign in instead
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { show, form, loading } = defineProps({
  show: Boolean,
  form: Object,
  loading: Boolean
})

const emit = defineEmits(['close', 'register', 'error', 'update:form', 'switch-to-login'])
const { validateRegistration } = useValidation()

const handleRegister = () => {
  // Perform frontend validation before emitting
  const validation = validateRegistration(
    form?.email || '', 
    form?.password || '', 
    form?.confirmPassword || ''
  )
  
  if (!validation.isValid) {
    // Emit an error event instead of just logging
    emit('error', validation.error)
    return
  }
  
  // Emit register event with normalized email
  emit('register', {
    email: validation.normalizedEmail,
    password: form?.password
  })
}
</script>
