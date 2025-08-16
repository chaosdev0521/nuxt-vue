<template>
  <div class="p-6">
    <div class="mb-6">
      <NuxtLink 
        :to="`/transactions/${$route.query.id || ''}`"
        class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
      >
        ← Back to Transaction Details
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600 dark:text-gray-400">Loading transaction...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-4">
      {{ error }}
    </div>

    <!-- Edit Form -->
    <div v-else-if="transaction" class="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden transition-colors">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Transaction</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Amount -->
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount *
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              id="amount"
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="block w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Reason -->
        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason *
          </label>
          <input
            id="reason"
            v-model="form.reason"
            type="text"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
            placeholder="Enter transaction reason"
          />
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            v-model="form.status"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <!-- From (Sender) -->
        <div>
          <label for="sender_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From (Sender Email) *
          </label>
          <input
            id="sender_email"
            v-model="form.sender_email"
            type="email"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
            placeholder="sender@example.com"
          />
        </div>

        <!-- To (Receiver) -->
        <div>
          <label for="receiver_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To (Receiver Email) *
          </label>
          <input
            id="receiver_email"
            v-model="form.receiver_email"
            type="email"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
            placeholder="receiver@example.com"
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-700">
          <NuxtLink 
            :to="`/transactions/${transaction.id}`"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors"
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
const toast = useToast()

const transaction = ref(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

// Form data
const form = ref({
  amount: '',
  reason: '',
  status: 'pending',
  sender_email: '',
  receiver_email: ''
})

// Users for dropdowns
const users = ref([])
const loadingUsers = ref(false)

// Get transaction ID from route query or params
const transactionId = computed(() => {
  return route.query.id || route.params.id
})

// Fetch all users for email to ID conversion
const fetchUsers = async () => {
  loadingUsers.value = true
  const { data, error: apiError } = await apiCall('/users')
  
  if (!apiError && data) {
    users.value = data
  }
  loadingUsers.value = false
}

// Helper function to get user ID from email
const getUserIdFromEmail = (email) => {
  const user = users.value.find(u => u.email === email)
  return user ? user.id : null
}

const fetchTransaction = async () => {
  if (!transactionId.value) {
    error.value = 'Transaction ID is required'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await apiCall(`/transactions/${transactionId.value}`)
  
  if (apiError) {
    error.value = apiError
  } else if (data) {
    transaction.value = data
    
    // Populate form with transaction data
    form.value = {
      amount: data.amount?.toString() || '',
      reason: data.reason || '',
      status: data.status || 'pending',
      sender_email: data.sender_email || '',
      receiver_email: data.receiver_email || ''
    }
  }
  
  loading.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''

  try {
    // Convert emails to IDs
    const senderId = getUserIdFromEmail(form.value.sender_email.trim())
    const receiverId = getUserIdFromEmail(form.value.receiver_email.trim())

    if (!senderId) {
      error.value = 'Sender email not found. Please enter a valid sender email.'
      toast.error('Invalid Sender', 'Sender email not found')
      submitting.value = false
      return
    }

    if (!receiverId) {
      error.value = 'Receiver email not found. Please enter a valid receiver email.'
      toast.error('Invalid Receiver', 'Receiver email not found')
      submitting.value = false
      return
    }

    const { error: apiError } = await apiCall(`/transactions/${transactionId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        amount: parseFloat(form.value.amount),
        reason: form.value.reason.trim(),
        status: form.value.status,
        sender_id: senderId,
        receiver_id: receiverId
      })
    })

    if (apiError) {
      error.value = apiError
      toast.error('Update Failed', apiError)
    } else {
      toast.success('Transaction Updated!', `Successfully updated transaction #${transactionId.value}`)
      // Redirect back to transaction details
      router.push(`/transactions/${transactionId.value}`)
    }
  } catch (err) {
    error.value = 'Failed to update transaction'
    toast.error('Update Failed', 'Failed to update transaction')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchTransaction()
  fetchUsers()
})
</script>
