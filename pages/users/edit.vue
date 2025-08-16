<template>
  <div class="p-6">
    <div class="mb-6">
      <NuxtLink 
        :to="`/users/${$route.query.id || ''}`"
        class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
      >
        ← Back to User Details
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Loading user...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
      {{ error }}
    </div>

    <!-- Edit Form -->
    <div v-else-if="user" class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="user@example.com"
          />
        </div>

        <!-- Roles -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            User Roles *
          </label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="role-user"
                v-model="form.roles"
                type="checkbox"
                value="user"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="role-user" class="ml-2 block text-sm text-gray-700">
                User - Basic user permissions
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="role-manager"
                v-model="form.roles"
                type="checkbox"
                value="manager"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="role-manager" class="ml-2 block text-sm text-gray-700">
                Manager - Administrative permissions
              </label>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Select at least one role for the user
          </p>
        </div>

        <!-- Password Reset -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave empty to keep current password"
          />
          <p class="mt-2 text-sm text-gray-500">
            Only fill this field if you want to change the user's password
          </p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <NuxtLink 
            :to="`/users/${user.id}`"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'manager',
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { apiCall } = useApi()

const user = ref(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

// Form data
const form = ref({
  email: '',
  roles: [],
  password: ''
})

// Get user ID from route query or params
const userId = computed(() => {
  return route.query.id || route.params.id
})

const fetchUser = async () => {
  if (!userId.value) {
    error.value = 'User ID is required'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await apiCall(`/users/${userId.value}`)
  
  if (apiError) {
    error.value = apiError
  } else if (data) {
    user.value = data
    
    // Populate form with user data
    form.value = {
      email: data.email || '',
      roles: Array.isArray(data.roles) ? [...data.roles] : [],
      password: ''
    }
  }
  
  loading.value = false
}

const handleSubmit = async () => {
  // Validate that at least one role is selected
  if (!form.value.roles || form.value.roles.length === 0) {
    error.value = 'Please select at least one role for the user'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const updateData = {
      email: form.value.email.trim(),
      roles: form.value.roles
    }

    // Only include password if it's provided
    if (form.value.password.trim()) {
      updateData.password = form.value.password.trim()
    }

    const { error: apiError } = await apiCall(`/users/${userId.value}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })

    if (apiError) {
      error.value = apiError
    } else {
      // Redirect back to user details
      router.push(`/users/${userId.value}`)
    }
  } catch (err) {
    error.value = 'Failed to update user'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUser()
})
</script>
