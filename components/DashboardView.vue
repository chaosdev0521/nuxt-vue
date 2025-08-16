<template>
  <div class="space-y-3 p-3">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">Welcome back, {{ formatEmailDisplay(user?.email) }}! 👋</h1>
          <p class="text-blue-100 text-lg">{{ isManager ? 'Manager Dashboard' : 'Your Financial Overview' }}</p>
        </div>
        <div class="hidden md:block">
            <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" :class="isManager ? 'lg:grid-cols-3' : 'lg:grid-cols-2'">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Amount</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">${{ stats.totalAmount.toFixed(2) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 dark:text-green-400 text-sm font-medium">+5.2%</span>
          <span class="text-slate-500 dark:text-slate-400 text-sm ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Transactions</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.totalTransactions }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">Total count</span>
        </div>
      </div>
      <div v-if="isManager" class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.totalUsers || 1 }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-orange-600 dark:text-orange-400 text-sm font-medium">{{ stats.activeUsers || 1 }} active</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Transactions -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <button @click="$emit('navigate', 'transactions')" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View all →
            </button>
          </div>
        </div>
        <div class="p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-600">Loading transactions...</div>
      </div>
      <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
        <p class="text-slate-500 dark:text-slate-400">No transactions yet</p>
        <button @click="$emit('navigate', 'transactions')" class="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          {{ isManager ? 'Create your first transaction' : 'View transactions' }}
        </button>
      </div>
      <div v-else class="space-y-4">
        <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              getTransactionType(transaction) === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
            ]">
              <svg class="w-5 h-5" :class="getTransactionType(transaction) === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="getTransactionType(transaction) === 'income'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">{{ transaction.reason }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ transaction.sender_email }} → {{ transaction.receiver_email }}</p>
            </div>
          </div>
          <div class="text-right">
            <p :class="[
              'font-semibold',
              getTransactionType(transaction) === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
              {{ getAmountDisplay(transaction) }}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ formatDate(transaction.created_at) }}</p>
          </div>
        </div>
      </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        </div>
        <div class="p-6 space-y-4">
          <button @click="$emit('navigate', 'transactions')" class="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-left">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <div>
                <p class="font-semibold">Add Transaction</p>
                <p class="text-sm text-blue-100">Record income or expense</p>
              </div>
            </div>
          </button>
          <button v-if="isManager" @click="$emit('navigate', 'users')" class="w-full p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-left">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-3 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
              </svg>
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">Manage Users</p>
                <p class="text-sm text-slate-600 dark:text-slate-400">User administration</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
  isManager: Boolean
})

defineEmits(['navigate'])

const { apiCall } = useApi()

// Stats and data
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalTransactions: 0,
  totalAmount: 0
})

const recentTransactions = ref([])
const loading = ref(true)

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // Fetch recent transactions
    const { data: transactionData } = await apiCall('/transactions')
    if (transactionData) {
      recentTransactions.value = transactionData.slice(0, 5) // Show only recent 5
      stats.value.totalTransactions = transactionData.length
      stats.value.totalAmount = transactionData.reduce((sum, t) => sum + parseFloat(t.amount), 0)
    }

    // Fetch users stats (only for managers)
    const authStore = useAuthStore()
    if (authStore.isManager) {
      const { data: userData } = await apiCall('/users')
      if (userData) {
        stats.value.totalUsers = userData.length
        stats.value.activeUsers = userData.length // For now, assume all users are active
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Helper functions for transactions
const getTransactionType = (transaction) => {
  const authStore = useAuthStore()
  return transaction.receiver_id === authStore.user?.id ? 'income' : 'expense'
}

const getAmountDisplay = (transaction) => {
  const authStore = useAuthStore()
  const isReceiver = transaction.receiver_id === authStore.user?.id
  const prefix = isReceiver ? '+' : '-'
  return `${prefix}$${parseFloat(transaction.amount).toFixed(2)}`
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
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

// Load data on mount
onMounted(() => {
  fetchDashboardData()
})
</script>
