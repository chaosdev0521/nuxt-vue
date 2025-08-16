<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
              Transaction Manager
            </NuxtLink>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4" v-if="authStore.isAuthenticated">
            <NuxtLink 
              to="/transactions" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Transactions
            </NuxtLink>
            
            <NuxtLink 
              v-if="authStore.isManager"
              to="/users" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Users
            </NuxtLink>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ authStore.user?.email }}
                <span class="ml-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {{ authStore.isManager ? 'Manager' : 'User' }}
                </span>
              </span>
              <button 
                @click="authStore.logout()"
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login/Register Links -->
          <div class="flex items-center space-x-4" v-else>
            <NuxtLink 
              to="/login" 
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Register
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="mx-auto">
      <slot />
    </main>
    
    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
const authStore = useAuthStore()

// Load auth from storage on mount
onMounted(() => {
  authStore.loadFromStorage()
})
</script>
