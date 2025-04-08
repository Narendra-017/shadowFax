import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
const LastMileLoginForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    try {
      const response = await axios.get('http://localhost:8005/user/login', {
        withCredentials: true,
      })

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        navigate('/dashboard')
      } else {
        setError('Invalid login credentials.')
      }
    } catch (error) {
      setError(error.response?.data?.message ||'Login failed. Please try again.')
      
    }
  }

  return (
    <div className="w-full max-w-lg p-6">
      <h2 className="text-4xl font-bold text-gray-900 text-center">
        Login as Last Mile
      </h2>
      <p className="text-gray-500 text-center text-lg font-medium mt-2">
        Welcome back. Enter your credentials to access your account.
      </p>

      <form onSubmit={handleFormSubmit} className="mt-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-gray-700 text-lg font-semibold">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-gray-700 text-lg font-semibold">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="**********"
            className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-gray-900 pr-12 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[54px] right-4 text-gray-600"
          >
            {showPassword ? (
              <FiEyeOff className="text-lg" />
            ) : (
              <FiEye className="text-lg" />
            )}
          </button>
        </div>

        <div className="text-right mt-2">
          <Link to="/forgot-password" className="text-gray-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-950 text-white py-3 mt-4 rounded-lg hover:bg-gray-800 text-xl"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default LastMileLoginForm
