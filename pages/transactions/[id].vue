<template>
  <div class="p-3">
    <div class="mb-6">
      <NuxtLink 
        to="/transactions" 
        class="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
      >
        ← Back to Transactions
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Loading transaction...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <!-- Transaction Details -->
    <div v-else-if="transaction" class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Transaction Details</h1>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <!-- Amount -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Amount</dt>
            <dd 
              class="mt-1 text-2xl font-semibold"
              :class="getAmountClass(transaction)"
            >
              {{ getAmountDisplay(transaction) }}
            </dd>
          </div>

          <!-- Status -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1">
              <span 
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="getStatusClass(transaction.status)"
              >
                {{ transaction.status }}
              </span>
            </dd>
          </div>

          <!-- Reason -->
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Reason</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ transaction.reason }}</dd>
          </div>

          <!-- Sender -->
          <div>
            <dt class="text-sm font-medium text-gray-500">From</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ transaction.sender_email }}</dd>
          </div>

          <!-- Receiver -->
          <div>
            <dt class="text-sm font-medium text-gray-500">To</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ transaction.receiver_email }}</dd>
          </div>

          <!-- Created At -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Created At</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(transaction.created_at) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Manager Actions -->
      <div v-if="authStore.isManager" class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
        <div class="flex space-x-3">
          <NuxtLink 
            :to="`/transactions/edit?id=${transaction.id}`"
            class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Edit Transaction
          </NuxtLink>
          
          <button 
            @click="confirmDelete"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Delete Transaction
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[420px] shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this transaction? 
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          >
            Cancel
          </button>
          <button 
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { apiCall } = useApi()
const toast = useToast()

const transaction = ref(null)
const loading = ref(true)
const error = ref('')
const showDeleteModal = ref(false)

const fetchTransaction = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await apiCall(`/transactions/${route.params.id}`)
  
  if (apiError) {
    error.value = apiError
  } else {
    transaction.value = data
  }
  
  loading.value = false
}

const getAmountClass = (transaction) => {
  const isReceiver = transaction.receiver_id === authStore.user?.id
  return isReceiver ? 'text-green-600' : 'text-red-600'
}

const getAmountDisplay = (transaction) => {
  const isReceiver = transaction.receiver_id === authStore.user?.id
  const prefix = isReceiver ? '+' : '-'
  return `${prefix}$${parseFloat(transaction.amount).toFixed(2)}`
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  const { error: apiError } = await apiCall(`/transactions/${route.params.id}`, {
    method: 'DELETE'
  })
  
  if (apiError) {
    error.value = apiError
    showDeleteModal.value = false
    toast.error('Delete Failed', apiError)
  } else {
    toast.success('Transaction Deleted!', `Successfully deleted transaction #${route.params.id}`)
    router.push('/transactions')
  }
}

onMounted(() => {
  fetchTransaction()
})
</script>
