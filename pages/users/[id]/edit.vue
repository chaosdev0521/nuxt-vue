<template>
  <div class="p-3">
    <div class="mb-6">
      <NuxtLink 
        :to="`/users/${route.params.id}`" 
        class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
      >
        ← Back to User
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Loading...</div>
    </div>

    <div v-else class="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Edit User #{{ route.params.id }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <!-- Roles -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Roles *
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="form.roles"
                  value="user"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-900">User</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="form.roles"
                  value="manager"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-900">Manager</span>
              </label>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Select at least one role. Users need the "user" role to access the system.
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <NuxtLink 
              :to="`/users/${route.params.id}`"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md"
            >
              {{ submitting ? 'Updating...' : 'Update User' }}
            </button>
          </div>
        </form>
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
const router = useRouter()
const { apiCall } = useApi()
const toast = useToast()

const form = ref({
  email: '',
  roles: []
})

const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const fetchUser = async () => {
  loading.value = true
  
  const { data, error: apiError } = await apiCall(`/users/${route.params.id}`)
  
  if (apiError) {
    error.value = apiError
  } else if (data) {
    form.value = {
      email: data.email,
      roles: data.roles || []
    }
  }
  
  loading.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  
  // Validation
  if (form.value.roles.length === 0) {
    error.value = 'Please select at least one role'
    submitting.value = false
    return
  }
  
  const { data, error: apiError } = await apiCall(`/users/${route.params.id}`, {
    method: 'PUT',
    body: {
      email: form.value.email,
      roles: form.value.roles
    }
  })
  
  if (apiError) {
    error.value = apiError
    toast.error('User Update Failed', apiError)
  } else {
    toast.success('User Updated!', `Successfully updated user ${form.value.email}`)
    router.push(`/users/${route.params.id}`)
  }
  
  submitting.value = false
}

onMounted(() => {
  fetchUser()
})
</script>
