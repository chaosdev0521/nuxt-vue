<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <!-- Top Navigation -->
    <nav
      class="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              Transaction Management
            </NuxtLink>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button @click="themeStore.toggleTheme()"
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
              title="Toggle theme">
              <!-- Sun Icon (Light Mode) -->
              <svg v-if="themeStore.isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                </path>
              </svg>
              <!-- Moon Icon (Dark Mode) -->
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>

            <!-- User Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button @click="toggleDropdown"
                class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-white">{{ getEmailInitial(authStore.user?.email) }}</span>
                </div>
                <div>
                  <span class="text-md text-gray-600 dark:text-gray-300 hidden md:block">
                    {{ formatEmailDisplay(authStore.user?.email) }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="showDropdown"
                  class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-base font-bold text-white">{{ getEmailInitial(authStore.user?.email) }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatEmailDisplay(authStore.user?.email) }}
                        </div>
                        <!-- <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ authStore.user?.email }}
                        </div> -->
                        <span
                          class="mt-1 inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                          {{ authStore.isManager ? 'Manager' : 'User' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Logout Button -->
                  <div class="px-4 py-3">
                    <button @click="handleLogout"
                      class="flex items-center w-full text-left px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                        </path>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-white dark:bg-slate-800 shadow-sm min-h-screen border-r border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <div class="p-2">
          <nav class="space-y-2">
            <!-- Dashboard -->
            <NuxtLink to="/dashboard"
              class="flex items-center py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path === '/dashboard' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-l-4 border-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400'">
              <div class="flex items-center justify-center w-8 h-8 mr-3 ml-4">
                <svg class="w-6 h-6"
                  :class="$route.path === '/dashboard' ? 'text-white' : 'text-slate-600 dark:text-slate-300'"
                  viewBox="0 0 24 24" fill="currentColor">
                  <!-- Dashboard Icon: Grid with analytics -->
                  <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="13" y="3" width="8" height="5" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="3" y="13" width="5" height="8" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="10" y="13" width="11" height="8" rx="1" fill="currentColor" opacity="0.9" />
                  <!-- Chart dots -->
                  <circle cx="7" cy="7" r="1" fill="white" opacity="0.9" />
                  <circle cx="17" cy="6" r="0.8" fill="white" opacity="0.9" />
                </svg>
              </div>
              <span class="truncate pr-4">Dashboard</span>
            </NuxtLink>

            <!-- Transactions -->
            <NuxtLink to="/transactions"
              class="flex items-center py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/transactions') ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md border-l-4 border-green-700' : 'text-slate-700 hover:bg-slate-100 hover:text-green-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-green-400'">
              <div class="flex items-center justify-center w-8 h-8 mr-3 ml-4">
                <svg class="w-6 h-6"
                  :class="$route.path.startsWith('/transactions') ? 'text-white' : 'text-slate-600 dark:text-slate-300'"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <!-- Transactions Icon: Money exchange -->
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
                  <path d="m15 9-6 6" stroke="currentColor" stroke-width="2" />
                  <path d="m9 9 6 6" stroke="currentColor" stroke-width="2" />
                  <path d="M9 9h.01M15 15h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <!-- Dollar signs -->
                  <text x="6" y="8" font-family="Arial" font-size="4" fill="currentColor">$</text>
                  <text x="16" y="19" font-family="Arial" font-size="4" fill="currentColor">$</text>
                </svg>
              </div>
              <span class="truncate pr-4">Transactions</span>
            </NuxtLink>

            <!-- User Management (Manager Only) -->
            <NuxtLink v-if="authStore.isManager" to="/users"
              class="flex items-center py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/users') ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-l-4 border-purple-700' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-purple-400'">
              <div class="flex items-center justify-center w-8 h-8 mr-3 ml-4">
                <svg class="w-6 h-6"
                  :class="$route.path.startsWith('/users') ? 'text-white' : 'text-slate-600 dark:text-slate-300'"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <!-- User Management Icon -->
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" />
                  <path d="m22 11-3-3m0 0-3 3m3-3v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <circle cx="19" cy="8" r="2" stroke="currentColor" stroke-width="1.5" opacity="0.7" />
                </svg>
              </div>
              <span class="truncate pr-4">User Management</span>
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <slot />
      </main>
    </div>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Dropdown state
const showDropdown = ref(false)
const dropdownRef = ref(null)

// Dropdown functions
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLogout = () => {
  showDropdown.value = false
  authStore.logout()
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Email helper functions
const getEmailInitial = (email) => {
  if (!email) return '?'
  const name = email.split('@')[0]
  return name.charAt(0).toUpperCase()
}

const formatEmailDisplay = (email) => {
  if (!email) return ''
  // Show only the name part before @ for gmail.com addresses
  if (email.includes('@gmail.com')) {
    return email.split('@')[0]
  }
  // For other domains, show full email
  return email
}

// Load auth and theme from storage on mount
onMounted(() => {
  authStore.loadFromStorage()
  themeStore.initTheme()

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
