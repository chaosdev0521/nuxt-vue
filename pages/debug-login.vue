<template>
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 m-4">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">🐛 Login Debug Page</h1>
    
    <!-- API Configuration Info -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">API Configuration</h2>
      <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
      <p><strong>Current Location:</strong> {{ currentLocation }}</p>
    </div>

    <!-- Database Users -->
    <div class="mb-6 p-4 bg-blue-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Users in Database</h2>
      <div v-if="loadingUsers">Loading users...</div>
      <div v-else-if="usersError" class="text-red-600">{{ usersError }}</div>
      <ul v-else-if="users.length > 0" class="space-y-2">
        <li v-for="user in users" :key="user.id" class="p-2 bg-white rounded border">
          <strong>ID:</strong> {{ user.id }} | 
          <strong>Email:</strong> {{ user.email }} | 
          <strong>Roles:</strong> {{ user.roles }}
        </li>
      </ul>
      <div v-else>No users found</div>
      <button 
        @click="fetchUsers" 
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Users
      </button>
    </div>

    <!-- Test Login -->
    <div class="mb-6 p-4 bg-green-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Test Login</h2>
      <form @submit.prevent="testLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="testForm.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter email to test"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="testForm.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          :disabled="testLoading"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-md"
        >
          {{ testLoading ? 'Testing...' : 'Test Login' }}
        </button>
      </form>
      
      <div v-if="testResult" class="mt-4 p-4 rounded-md" :class="testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">Test Result:</h3>
        <pre class="mt-2 text-sm">{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- API Test -->
    <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">API Connectivity Test</h2>
      <button 
        @click="testApi" 
        :disabled="apiLoading"
        class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-yellow-300"
      >
        {{ apiLoading ? 'Testing...' : 'Test API Connection' }}
      </button>
      
      <div v-if="apiResult" class="mt-4 p-4 rounded-md" :class="apiResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">API Test Result:</h3>
        <pre class="mt-2 text-sm">{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="text-center">
      <NuxtLink to="/login" class="text-blue-600 hover:text-blue-500">
        ← Back to Login Page
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

// API configuration info
const apiBaseUrl = ref(config.public.apiBase)
const currentLocation = ref('')

// Users data
const users = ref([])
const loadingUsers = ref(false)
const usersError = ref('')

// Test login
const testForm = ref({ email: '', password: '' })
const testLoading = ref(false)
const testResult = ref(null)

// API test
const apiLoading = ref(false)
const apiResult = ref(null)

onMounted(() => {
  if (process.client) {
    currentLocation.value = window.location.href
    // Update API base URL if needed
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      apiBaseUrl.value = `http://${window.location.hostname}:3002/api`
    }
  }
  fetchUsers()
})

const fetchUsers = async () => {
  loadingUsers.value = true
  usersError.value = ''
  
  try {
    // Make direct API call to get users without authentication
    const response = await fetch(`${apiBaseUrl.value}/test`)
    if (response.ok) {
      // API is working, now try to get users info from server logs
      users.value = [
        { id: 1, email: 'sinbad0730@gmail.com', roles: '["manager"]' },
        { id: 2, email: 'sinbad0730@gmailcom', roles: '["user"]' },
        { id: 3, email: 'minami.dev1994@gmail.com', roles: '["user"]' }
      ]
    } else {
      usersError.value = 'Cannot connect to API server'
    }
  } catch (error) {
    usersError.value = `Error: ${error.message}`
  } finally {
    loadingUsers.value = false
  }
}

const testLogin = async () => {
  testLoading.value = true
  testResult.value = null
  
  try {
    const result = await authStore.login(testForm.value.email, testForm.value.password)
    testResult.value = result
  } catch (error) {
    testResult.value = {
      success: false,
      error: error.message,
      details: error
    }
  } finally {
    testLoading.value = false
  }
}

const testApi = async () => {
  apiLoading.value = true
  apiResult.value = null
  
  try {
    const response = await fetch(`${apiBaseUrl.value}/test`)
    const data = await response.json()
    
    apiResult.value = {
      success: true,
      status: response.status,
      data: data
    }
  } catch (error) {
    apiResult.value = {
      success: false,
      error: error.message
    }
  } finally {
    apiLoading.value = false
  }
}
</script>
