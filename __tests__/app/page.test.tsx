import React from 'react'
import { render, screen } from '@testing-library/react'
import Landing from '@/app/page'

// Mock the components that are imported
jest.mock('@/Components/StockListLineGraph', () => {
  return function MockDemo() {
    return <div data-testid="stock-demo">Stock Demo Component</div>
  }
})

jest.mock('@/Components/dashboard/LiveTicker', () => {
  return function MockLiveTicker() {
    return <div data-testid="live-ticker">Live Ticker Component</div>
  }
})

jest.mock('@/Components/dashboard/MarketIndices', () => {
  return function MockMarketIndices() {
    return <div data-testid="market-indices">Market Indices Component</div>
  }
})

describe('Landing Page', () => {
  it('renders the main heading', () => {
    render(<Landing />)
    
    expect(screen.getByText(/Effective, Easy/)).toBeInTheDocument()
    expect(screen.getByText(/Trading Platform/)).toBeInTheDocument()
    expect(screen.getByText('Free, Open Source and Secure')).toBeInTheDocument()
  })

  it('displays the platform description', () => {
    render(<Landing />)
    
    expect(screen.getByText(/3Z-Analysis/)).toBeInTheDocument()
    expect(screen.getByText(/simulation trading platform/)).toBeInTheDocument()
    expect(screen.getByText(/Money is Freedom/)).toBeInTheDocument()
  })

  it('renders authentication buttons', () => {
    render(<Landing />)
    
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Guest' })).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(<Landing />)
    
    const signUpLink = screen.getByRole('link', { name: 'Sign Up' })
    const logInLink = screen.getByRole('link', { name: 'Log In' })
    const guestLink = screen.getByRole('link', { name: 'Guest' })
    
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
    expect(logInLink).toHaveAttribute('href', '/sign-in')
    expect(guestLink).toHaveAttribute('href', '/home')
  })

  it('displays account creation section', () => {
    render(<Landing />)
    
    expect(screen.getByText('Create an Account for Free')).toBeInTheDocument()
    expect(screen.getByText('log in or use our service as a guest.')).toBeInTheDocument()
    expect(screen.getByText(/To access extended features/)).toBeInTheDocument()
  })

  it('renders live market data components', () => {
    render(<Landing />)
    
    expect(screen.getByTestId('live-ticker')).toBeInTheDocument()
    expect(screen.getByTestId('market-indices')).toBeInTheDocument()
  })

  it('displays how it works section', () => {
    render(<Landing />)
    
    expect(screen.getByText('How does 3Z Analysis Work?')).toBeInTheDocument()
    expect(screen.getByText(/3Z is a powerful financial tool coded in Python/)).toBeInTheDocument()
    expect(screen.getByText('But why should I use 3Z?')).toBeInTheDocument()
  })

  it('renders the stock demo component', () => {
    render(<Landing />)
    
    expect(screen.getByTestId('stock-demo')).toBeInTheDocument()
  })

  it('displays technology stack section', () => {
    render(<Landing />)
    
    expect(screen.getByText('Thank you')).toBeInTheDocument()
    expect(screen.getByText(/This project makes use of smart solutions/)).toBeInTheDocument()
  })

  it('renders technology links', () => {
    render(<Landing />)
    
    const reactLink = screen.getByText('React').closest('a')
    const nextLink = screen.getByText('Next.js').closest('a')
    const tailwindLink = screen.getByText('Tailwind CSS').closest('a')
    const shadcnLink = screen.getByText('Shadcn UI').closest('a')
    
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')
    expect(nextLink).toHaveAttribute('href', 'https://nextjs.org')
    expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com')
    expect(shadcnLink).toHaveAttribute('href', 'https://ui.shadcn.com')
  })

  it('has proper external link attributes', () => {
    render(<Landing />)
    
    const externalLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.startsWith('http')
    )
    
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('displays personal website link', () => {
    render(<Landing />)
    
    const personalLink = screen.getByText('personal website').closest('a')
    expect(personalLink).toHaveAttribute('href', 'https://toadboychen.github.io/')
  })

  it('renders main image', () => {
    render(<Landing />)
    
    const mainImage = screen.getByAltText('Trading platform illustration')
    expect(mainImage).toBeInTheDocument()
    expect(mainImage).toHaveAttribute('src', '/ez-money-home-cropped-2.svg')
  })

  it('displays technology stack images', () => {
    render(<Landing />)
    
    const techImages = [
      { alt: 'React', src: '/react.svg' },
      { alt: 'Next.js', src: '/next.svg' },
      { alt: 'Tailwind CSS', src: '/tailwindcss.svg' },
      { alt: 'Shadcn UI', src: '/shadcn.ico' }
    ]
    
    techImages.forEach(({ alt, src }) => {
      const image = screen.getByAltText(alt)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', src)
    })
  })

  it('has proper semantic structure', () => {
    render(<Landing />)
    
    // Check for main section
    const mainSection = document.querySelector('section')
    expect(mainSection).toBeInTheDocument()
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByText(/Effective, Easy/)
    expect(mainHeading.tagName).toBe('P') // This is actually in a p tag in your component
  })

  it('displays separators for content sections', () => {
    render(<Landing />)
    
    // The Separator components should be rendered
    // Since they're custom components, we check for their presence indirectly
    const separators = document.querySelectorAll('[role="separator"]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('has responsive layout classes', () => {
    render(<Landing />)
    
    // Check for responsive flex classes
    const mainContainer = document.querySelector('.flex.flex-col')
    expect(mainContainer).toBeInTheDocument()
    
    const rowContainer = document.querySelector('.flex.flex-row')
    expect(rowContainer).toBeInTheDocument()
  })

  it('displays button hover effects', () => {
    render(<Landing />)
    
    const signUpButton = screen.getByRole('link', { name: 'Sign Up' })
    expect(signUpButton).toHaveClass('hover:scale-105')
    
    const logInButton = screen.getByRole('link', { name: 'Log In' })
    expect(logInButton).toHaveClass('hover:scale-105')
    
    const guestButton = screen.getByRole('link', { name: 'Guest' })
    expect(guestButton).toHaveClass('hover:scale-105')
  })

  it('uses CSS custom properties for theming', () => {
    render(<Landing />)
    
    // Check that elements use CSS custom properties
    const accentText = screen.getByText('3Z-Analysis')
    expect(accentText).toHaveClass('text-[var(--colour-accent-standard)]')
  })
})
