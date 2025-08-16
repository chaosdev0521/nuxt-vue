// Email validation composable

// Type definitions
interface ValidationResult {
  isValid: boolean
  error?: string
  normalizedEmail?: string
}

interface EmailAvailabilityResult {
  available: boolean
  error?: string
  message?: string
}

interface EmailCheckResponse {
  available: boolean
  message: string
  error?: string
}

// Explicit discriminated union types for safe narrowing
type EmailValidationResult =
  | { isValid: true; normalizedEmail: string }
  | { isValid: false; error: string }

type PasswordValidationResult =
  | { isValid: true }
  | { isValid: false; error: string }

type RegistrationValidationResult =
  | { isValid: true; normalizedEmail: string }
  | { isValid: false; error: string }

export const useValidation = () => {
  // Email validation function
  const validateEmail = (email: string): EmailValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Email is required' }
    }
    
    // Normalize email first (trim and convert to lowercase)
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check email format using regex after normalization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    
    // Check email length
    if (normalizedEmail.length > 254) {
      return { isValid: false, error: 'Email address is too long' }
    }
    
    return { isValid: true, normalizedEmail }
  }

  // Password validation function
  const validatePassword = (password: string, confirmPassword?: string): PasswordValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Password is required' }
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' }
    }
    
    if (password.length > 128) {
      return { isValid: false, error: 'Password is too long (maximum 128 characters)' }
    }
    
    // Check for password confirmation match if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' }
    }
    
    return { isValid: true }
  }

  // Combined registration validation
  const validateRegistration = (
    email: string,
    password: string,
    confirmPassword: string
  ): RegistrationValidationResult => {
    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return { isValid: false, error: emailValidation.error }
    }

    // Validate password
    const passwordValidation = validatePassword(password, confirmPassword)
    if (!passwordValidation.isValid) {
      return { isValid: false, error: passwordValidation.error }
    }

    return {
      isValid: true,
      normalizedEmail: emailValidation.normalizedEmail
    }
  }

  // Check if email has valid format (real-time validation)
  const isValidEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  // Check if email is available via API
  const checkEmailAvailability = async (email: string) => {
    if (!email || !isValidEmailFormat(email)) {
      return { available: false, error: 'Invalid email format' }
    }

    try {
      const { apiCall } = useApi()
      const { data, error } = await apiCall('/auth/check-email', {
        method: 'POST',
        body: { email }
      })

      if (error) {
        return { available: false, error }
      }

      const response = data as EmailCheckResponse
      return {
        available: response.available,
        message: response.message
      }
    } catch (err) {
      return {
        available: false,
        error: 'Unable to check email availability'
      }
    }
  }

  return {
    validateEmail,
    validatePassword,
    validateRegistration,
    isValidEmailFormat,
    checkEmailAvailability
  }
}
