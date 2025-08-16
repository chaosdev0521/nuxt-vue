<template>
  <div class="p-3">
    <div class="mb-6">
      <NuxtLink 
        to="/users" 
        class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
      >
        ← Back to Users
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Loading user...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <!-- User Details -->
    <div v-else-if="user" class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">User Details</h1>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <!-- Email -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
          </div>

          <!-- Roles -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Roles</dt>
            <dd class="mt-1">
              <span 
                v-for="role in user.roles" 
                :key="role"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2"
                :class="getRoleClass(role)"
              >
                {{ role }}
              </span>
            </dd>
          </div>

          <!-- Created At -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Joined</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(user.created_at) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Actions -->
      <div class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
        <div class="flex space-x-3">
          <NuxtLink 
            :to="`/users/edit?id=${user.id}`"
            class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Edit User
          </NuxtLink>
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

const route = useRoute()
const { apiCall } = useApi()

const user = ref(null)
const loading = ref(true)
const error = ref('')

const fetchUser = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await apiCall(`/users/${route.params.id}`)
  
  if (apiError) {
    error.value = apiError
  } else {
    user.value = data
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
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  fetchUser()
})
</script>
