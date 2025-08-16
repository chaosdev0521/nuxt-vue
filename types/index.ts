// Global type definitions for the application

export interface User {
  id: number
  email: string
  roles: string[]
  created_at?: string
  updated_at?: string
}

export interface Transaction {
  id: number
  sender_id: number
  receiver_id: number
  sender_email?: string
  receiver_email?: string
  reason: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  created_at: string
  updated_at?: string
}

export interface ApiResponse<T = any> {
  data: T | null
  error: string | null
  message?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form interfaces
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm extends LoginForm {
  confirmPassword?: string
}

export interface TransactionForm {
  sender_email: string
  receiver_email: string
  reason: string
  amount: number
  status: Transaction['status']
}

export interface UserForm {
  email: string
  roles: string[]
  password?: string
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  timestamp: number
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'

// API error types
export interface ApiError {
  message: string
  code?: string
  status?: number
  data?: any
}
