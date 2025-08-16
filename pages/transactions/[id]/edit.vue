<template>
  <div class="p-3">
    <div class="mb-6">
      <NuxtLink 
        :to="`/transactions/${route.params.id}`" 
        class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
      >
        ← Back to Transaction
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loadingTransaction || loadingUsers" class="text-center py-8">
      <div class="text-gray-600">Loading...</div>
    </div>

    <div v-else class="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Edit Transaction #{{ route.params.id }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Sender -->
          <div>
            <label for="sender" class="block text-sm font-medium text-gray-700 mb-1">
              Sender *
            </label>
            <select
              id="sender"
              v-model="form.sender_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <select
              id="receiver"
              v-model="form.receiver_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select receiver...</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.email }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              id="amount"
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <!-- Reason -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              id="reason"
              v-model="form.reason"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the reason for this transaction..."
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <NuxtLink 
              :to="`/transactions/${route.params.id}`"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md"
            >
              {{ loading ? 'Updating...' : 'Update Transaction' }}
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

const form = ref({
  sender_id: '',
  receiver_id: '',
  amount: '',
  reason: '',
  status: 'completed'
})

const users = ref([])
const loading = ref(false)
const loadingTransaction = ref(true)
const loadingUsers = ref(true)
const error = ref('')

const fetchTransaction = async () => {
  loadingTransaction.value = true
  
  const { data, error: apiError } = await apiCall(`/transactions/${route.params.id}`)
  
  if (apiError) {
    error.value = apiError
  } else if (data) {
    form.value = {
      sender_id: data.sender_id.toString(),
      receiver_id: data.receiver_id.toString(),
      amount: data.amount.toString(),
      reason: data.reason,
      status: data.status
    }
  }
  
  loadingTransaction.value = false
}

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
  
  const { data, error: apiError } = await apiCall(`/transactions/${route.params.id}`, {
    method: 'PUT',
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
  } else {
    router.push(`/transactions/${route.params.id}`)
  }
  
  loading.value = false
}

onMounted(() => {
  Promise.all([fetchTransaction(), fetchUsers()])
})
</script>
