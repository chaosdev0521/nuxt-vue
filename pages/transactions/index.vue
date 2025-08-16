<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
        <p class="text-slate-600 dark:text-slate-400 mt-1">
          {{ authStore.isManager ? 'All transactions' : 'Your transactions' }}
        </p>
      </div>
      <NuxtLink v-if="authStore.isManager" to="/transactions/create"
        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Create Transaction</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div class="ml-3 text-slate-600 dark:text-slate-400">Loading transactions...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
      <div class="flex">
        <svg class="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"></path>
        </svg>
        <div>
          <strong>Error:</strong> {{ error }}
          <br><small>Make sure the API server is running on port 3002</small>
        </div>
      </div>
    </div>

    <!-- Transactions Table - Always Show -->
    <div v-else class="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-hidden rounded-lg">
        <table class="w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Transaction
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                From / To
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Date
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <!-- Transactions Rows with zebra striping and hover -->
            <tr v-for="(transaction, idx) in transactions" :key="transaction.id"
              :class="[idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/10' : 'bg-white dark:bg-slate-800', 'hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 rounded-lg']">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ transaction.reason }}</div>
              </td>
              <td class="px-6 py-4" :style="{ width: '32vw', maxWidth: '40vw' }">
                <div class="text-sm text-slate-900 dark:text-white">
                  <div class="flex items-center space-x-2 min-w-0">
                    <div class="flex items-center min-w-0 flex-1">
                      <div
                        class="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{
                          getEmailInitial(transaction.sender_email) }}</span>
                      </div>
                      <span class="ml-2 font-medium truncate">{{ formatEmailDisplay(transaction.sender_email) }}</span>
                    </div>
                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                    <div class="flex items-center min-w-0 flex-1">
                      <div
                        class="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-medium text-green-600 dark:text-green-400">{{
                          getEmailInitial(transaction.receiver_email) }}</span>
                      </div>
                      <span class="ml-2 font-medium truncate">{{ formatEmailDisplay(transaction.receiver_email)
                        }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-lg font-semibold" :class="getAmountClass(transaction)">
                  {{ getAmountDisplay(transaction) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(transaction.status)">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <NuxtLink :to="`/transactions/${transaction.id}`"
                    class="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="View transaction">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                  </NuxtLink>
                  <template v-if="authStore.isManager">
                    <NuxtLink :to="`/transactions/edit?id=${transaction.id}`"
                      class="inline-flex items-center px-2 py-1 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                      title="Edit transaction">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                    </NuxtLink>
                    <button @click="confirmDelete(transaction)"
                      class="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      title="Delete transaction">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List -->
      <div class="lg:hidden space-y-4 p-4">
        <div v-for="transaction in transactions" :key="transaction.id"
          class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-slate-200 dark:border-slate-700 transition-all duration-150">
          <div class="flex justify-between items-center mb-2">
            <div class="font-bold text-lg text-slate-900 dark:text-white">{{ transaction.reason }}</div>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(transaction.status)">
              {{ transaction.status }}
            </span>
          </div>
          <div class="flex items-center space-x-2 mb-2">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{
                  getEmailInitial(transaction.sender_email) }}</span>
              </div>
              <span class="ml-2 font-medium">{{ formatEmailDisplay(transaction.sender_email) }}</span>
            </div>
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-orange dark:text-orange-400">{{
                  getEmailInitial(transaction.receiver_email) }}</span>
              </div>
              <span class="ml-2 font-medium">{{ formatEmailDisplay(transaction.receiver_email) }}</span>
            </div>
          </div>
          <div class="text-lg font-semibold mb-2" :class="getAmountClass(transaction)">
            {{ getAmountDisplay(transaction) }}
          </div>
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-2">{{ formatDate(transaction.created_at) }}</div>
          <div class="flex justify-end space-x-2">
            <NuxtLink :to="`/transactions/${transaction.id}`"
              class="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              title="View transaction">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
            </NuxtLink>
            <template v-if="authStore.isManager">
              <NuxtLink :to="`/transactions/edit?id=${transaction.id}`"
                class="inline-flex items-center px-2 py-1 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                title="Edit transaction">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
              </NuxtLink>
              <button @click="confirmDelete(transaction)"
                class="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Delete transaction">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="transactions.length === 0" class="p-16 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <h3 class="text-sm font-medium text-slate-900 dark:text-white mb-2">No transactions found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ authStore.isManager ? 'No transactions have been created yet.' : 'You have no transactions yet.' }}</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTransaction"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative mx-auto p-6 border max-w-md w-full shadow-xl rounded-lg bg-white dark:bg-slate-800">
        <div class="text-center">
          <svg class="mx-auto mb-4 w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
          <h3 class="mb-2 text-lg font-normal text-slate-900 dark:text-white">Are you sure you want to delete this
            transaction?</h3>
          <p class="mb-6 text-sm text-slate-500 dark:text-slate-400">Transaction: {{ deleteTransaction.reason }} ({{
            getAmountDisplay(deleteTransaction) }})</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button @click="deleteTransaction = null"
            class="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-900 dark:text-white rounded-lg transition-colors">
            Cancel
          </button>
          <button @click="handleDelete"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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

const authStore = useAuthStore()
const { apiCall } = useApi()

const transactions = ref([])
const loading = ref(true)
const error = ref('')
const deleteTransaction = ref(null)

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data, error: apiError } = await apiCall('/transactions')

    if (apiError) {
      error.value = apiError
    } else {
      transactions.value = data || []
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = 'Failed to fetch transactions'
  } finally {
    loading.value = false
  }
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
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
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

const confirmDelete = (transaction) => {
  deleteTransaction.value = transaction
}

const handleDelete = async () => {
  if (!deleteTransaction.value) return

  const { error: apiError } = await apiCall(`/transactions/${deleteTransaction.value.id}`, {
    method: 'DELETE'
  })

  if (apiError) {
    error.value = apiError
  } else {
    transactions.value = transactions.value.filter(t => t.id !== deleteTransaction.value.id)
    deleteTransaction.value = null
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>
