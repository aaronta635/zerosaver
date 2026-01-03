"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type UserRole = 'customer' | 'shop'

interface LoginForm {
  email: string
  password: string
  role: UserRole
}

interface RegisterForm {
  email: string
  name: string
  password: string
  confirmPassword: string
  role: UserRole
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState<LoginForm | RegisterForm>({
    email: '',
    password: '',
    role: 'customer',
    ...(isLogin ? {} : { name: '', confirmPassword: '' })
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            role: form.role
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Login failed')
        }

        const data = await response.json()
        
        // Store token and user info
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect based on role
        if (form.role === 'customer') {
          router.push('/customer')
        } else {
          router.push('/shop')
        }
      } else {
        // Register API call
        const registerForm = form as RegisterForm
        
        if (registerForm.password !== registerForm.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: registerForm.email,
            name: registerForm.name,
            password: registerForm.password,
            role: registerForm.role
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Registration failed')
        }

        // After successful registration, switch to login
        setIsLogin(true)
        setForm({
          email: registerForm.email,
          password: '',
          role: registerForm.role
        })
        setError('Registration successful! Please login.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setForm({
      email: '',
      password: '',
      role: form.role,
      ...(isLogin ? { name: '', confirmPassword: '' } : {})
    })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            <span className="bg-emerald-500 text-white px-2 py-1 rounded">Zero</span>
            <span className="ml-1">Saver</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Join us to reduce food waste'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'customer' }))}
              className={`p-3 rounded-xl border-2 transition-all ${
                form.role === 'customer'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🛒</div>
              <div className="font-medium">Customer</div>
              <div className="text-xs text-gray-500">Find great deals</div>
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'shop' }))}
              className={`p-3 rounded-xl border-2 transition-all ${
                form.role === 'shop'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🏪</div>
              <div className="font-medium">Shop Owner</div>
              <div className="text-xs text-gray-500">List your deals</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={(form as RegisterForm).name || ''}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={(form as RegisterForm).confirmPassword || ''}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isLogin ? (
            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Don't have an account? Sign up
            </Link>
          ) : (
            <button
              onClick={toggleMode}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
