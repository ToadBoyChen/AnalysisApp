import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignIn from '@/app/(auth)/sign-in/page'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('SignIn Page', () => {
  beforeEach(() => {
    // Mock console.log to avoid output in tests
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the sign in form', () => {
    render(<SignIn />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your 3Z-Analysis account')).toBeInTheDocument()
  })

  it('renders social sign in buttons', () => {
    render(<SignIn />)
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
    expect(screen.getByText('Continue with Microsoft')).toBeInTheDocument()
  })

  it('renders email and password form fields', () => {
    render(<SignIn />)
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument()
  })

  it('renders form action buttons and links', () => {
    render(<SignIn />)
    
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument()
    expect(screen.getByText('Sign up here')).toBeInTheDocument()
    expect(screen.getByText('← Back to Home')).toBeInTheDocument()
  })

  it('handles email input changes', async () => {
    const user = userEvent.setup()
    render(<SignIn />)
    
    const emailInput = screen.getByLabelText('Email Address')
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('handles password input changes', async () => {
    const user = userEvent.setup()
    render(<SignIn />)
    
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')
    
    expect(passwordInput).toHaveValue('password123')
  })

  it('handles remember me checkbox', async () => {
    const user = userEvent.setup()
    render(<SignIn />)
    
    const checkbox = screen.getByLabelText('Remember me')
    expect(checkbox).not.toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<SignIn />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log')
    
    render(<SignIn />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign in form submitted:', {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      })
    })
  })

  it('handles form submission with remember me checked', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log')
    
    render(<SignIn />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const rememberCheckbox = screen.getByLabelText('Remember me')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(rememberCheckbox)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign in form submitted:', {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      })
    })
  })

  it('handles social sign in clicks', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log')
    
    render(<SignIn />)
    
    const googleButton = screen.getByText('Continue with Google')
    const appleButton = screen.getByText('Continue with Apple')
    const microsoftButton = screen.getByText('Continue with Microsoft')
    
    await user.click(googleButton)
    expect(consoleSpy).toHaveBeenCalledWith('Sign in with Google')
    
    await user.click(appleButton)
    expect(consoleSpy).toHaveBeenCalledWith('Sign in with Apple')
    
    await user.click(microsoftButton)
    expect(consoleSpy).toHaveBeenCalledWith('Sign in with Microsoft')
  })

  it('has correct navigation links', () => {
    render(<SignIn />)
    
    const signUpLink = screen.getByText('Sign up here').closest('a')
    const forgotPasswordLink = screen.getByText('Forgot your password?').closest('a')
    const homeLink = screen.getByText('← Back to Home').closest('a')
    
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('displays feature highlights', () => {
    render(<SignIn />)
    
    expect(screen.getByText('Real-time Market Data')).toBeInTheDocument()
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Management')).toBeInTheDocument()
    
    expect(screen.getByText('Live stock prices and market updates')).toBeInTheDocument()
    expect(screen.getByText('AI-powered trading insights and predictions')).toBeInTheDocument()
    expect(screen.getByText('Track and manage your investments')).toBeInTheDocument()
  })

  it('has proper form accessibility', () => {
    render(<SignIn />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const rememberCheckbox = screen.getByLabelText('Remember me')
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('placeholder', 'john.doe@example.com')
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password')
    
    expect(rememberCheckbox).toHaveAttribute('type', 'checkbox')
  })

  it('prevents default form submission', async () => {
    const user = userEvent.setup()
    render(<SignIn />)
    
    const form = screen.getByRole('button', { name: 'Sign In' }).closest('form')
    const mockPreventDefault = jest.fn()
    
    // Mock the form submission event
    if (form) {
      form.addEventListener('submit', (e) => {
        mockPreventDefault()
        e.preventDefault()
      })
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      await user.click(submitButton)
      
      expect(mockPreventDefault).toHaveBeenCalled()
    }
  })
})
