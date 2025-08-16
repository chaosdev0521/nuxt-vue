<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Users Management</h1>
        <p class="text-slate-600 dark:text-slate-400 mt-1">Manage system users and permissions</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div class="ml-3 text-slate-600 dark:text-slate-400">Loading users...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
      <div class="flex">
        <svg class="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <strong>Error:</strong> {{ error }}
          <br><small>Make sure the API server is running on port 3002</small>
        </div>
      </div>
    </div>

    <!-- Users Table - Always Show -->
    <div v-else class="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Roles
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <!-- User Rows -->
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span class="text-sm font-bold text-white">{{ getEmailInitial(user.email) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-slate-900 dark:text-white">{{ formatEmailDisplay(user.email) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span 
                    v-for="role in user.roles" 
                    :key="role"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getRoleClass(role)"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <NuxtLink 
                    :to="`/users/${user.id}`"
                    class="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="View user"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </NuxtLink>
                  
                  <NuxtLink 
                    :to="`/users/edit?id=${user.id}`"
                    class="inline-flex items-center px-2 py-1 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                    title="Edit user"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
        <div v-for="user in users" :key="user.id" class="p-4 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3 flex-1">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <span class="text-lg font-bold text-white">{{ getEmailInitial(user.email) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ formatEmailDisplay(user.email) }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ user.email }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">User ID: {{ user.id }}</p>
              </div>
            </div>
          </div>
          
          <!-- Roles Section -->
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="role in user.roles" 
              :key="role"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getRoleClass(role)"
            >
              {{ role }}
            </span>
          </div>
          
          <!-- Date and Actions -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <div class="text-xs text-slate-500 dark:text-slate-400">
              Joined {{ formatDate(user.created_at) }}
            </div>
            <div class="flex space-x-3">
              <NuxtLink 
                :to="`/users/${user.id}`"
                class="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View
              </NuxtLink>
              
              <NuxtLink 
                :to="`/users/edit?id=${user.id}`"
                class="inline-flex items-center px-3 py-1.5 text-sm text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="users.length === 0" class="p-16 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
          </svg>
          <h3 class="text-sm font-medium text-slate-900 dark:text-white mb-2">No users found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">There are currently no users in the system.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'manager',
  layout: 'dashboard'
})

const { apiCall } = useApi()

const users = ref([])
const loading = ref(true)
const error = ref('')

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await apiCall('/users')
  
  if (apiError) {
    error.value = apiError
  } else {
    users.value = data || []
  }
  
  loading.value = false
}

const getRoleClass = (role) => {
  const classes = {
    manager: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
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

onMounted(() => {
  fetchUsers()
})
</script>
