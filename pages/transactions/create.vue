<template>
  <div class="p-3">
    <div class="mb-6">
      <NuxtLink to="/transactions" class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center">
        ← Back to Transactions
      </NuxtLink>
    </div>

    <div class="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Create New Transaction</h1>

        <!-- Loading Users -->
        <div v-if="loadingUsers" class="text-center py-4">
          <div class="text-gray-600">Loading users...</div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Sender -->
          <div>
            <label for="sender" class="block text-sm font-medium text-gray-700 mb-1">
              Sender *
            </label>
            <select id="sender" v-model="form.sender_id" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select sender...</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.email }}
              </option>
            </select>
          </div>

          <!-- Receiver -->
          <div>
            <label for="receiver" class="block text-sm font-medium text-gray-700 mb-1">
              Receiver *
            </label>
            <select id="receiver" v-model="form.receiver_id" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select receiver...</option>
              <option v-for="user in users.filter(u => u.id !== parseInt(form.sender_id))" :key="user.id"
                :value="user.id">
                {{ user.email }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input id="amount" v-model="form.amount" type="number" step="0.01" min="0.01" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00" />
          </div>

          <!-- Reason -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea id="reason" v-model="form.reason" required rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the reason for this transaction..."></textarea>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select id="status" v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <NuxtLink to="/transactions"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Cancel
            </NuxtLink>
            <button type="submit" :disabled="loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md">
              {{ loading ? 'Creating...' : 'Create Transaction' }}
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

const router = useRouter()
const { apiCall } = useApi()
const toast = useToast()

const form = ref({
  sender_id: '',
  receiver_id: '',
  amount: '',
  reason: '',
  status: 'completed'
})

const users = ref([])
const loading = ref(false)
const loadingUsers = ref(true)
const error = ref('')

const fetchUsers = async () => {
  loadingUsers.value = true

  const { data, error: apiError } = await apiCall('/users')

  if (apiError) {
    error.value = apiError
  } else {
    users.value = data || []
  }

  loadingUsers.value = false
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  // Validation
  if (form.value.sender_id === form.value.receiver_id) {
    error.value = 'Sender and receiver cannot be the same person'
    loading.value = false
    return
  }

  const { data, error: apiError } = await apiCall('/transactions', {
    method: 'POST',
    body: {
      sender_id: parseInt(form.value.sender_id),
      receiver_id: parseInt(form.value.receiver_id),
      amount: parseFloat(form.value.amount),
      reason: form.value.reason,
      status: form.value.status
    }
  })

  if (apiError) {
    error.value = apiError
    toast.error('Transaction Creation Failed', apiError)
  } else {
    toast.success('Transaction Created!', `Successfully created transaction for $${form.value.amount}`)
    router.push('/transactions')
  }

  loading.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>
