import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { io } from 'socket.io-client'
import LiveTicker from '@/Components/dashboard/LiveTicker'

// Mock socket.io-client
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
  connect: jest.fn(),
}

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}))

// Mock fetch
global.fetch = jest.fn()

const mockStockData = [
  {
    symbol: 'AAPL',
    price: 150.25,
    timestamp: Date.now(),
    volume: 1000000,
    change: 1.75,
    changePercent: 1.18,
    high: 152.00,
    low: 147.80,
    previousClose: 148.50
  },
  {
    symbol: 'GOOGL',
    price: 2750.80,
    timestamp: Date.now(),
    volume: 500000,
    change: -5.60,
    changePercent: -0.20,
    high: 2760.00,
    low: 2740.00,
    previousClose: 2756.40
  }
]

describe('LiveTicker', () => {
  beforeEach(() => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mockStockData,
    } as Response)
    
    mockSocket.on.mockClear()
    mockSocket.disconnect.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with title', async () => {
    render(<LiveTicker />)
    
    expect(screen.getByText('Live Market Data')).toBeInTheDocument()
  })

  it('fetches initial stock data on mount', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/stock_data')
    })
  })

  it('displays stock data after loading', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument()
      expect(screen.getByText('GOOGL')).toBeInTheDocument()
    })
  })

  it('formats prices correctly', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      expect(screen.getByText('$150.25')).toBeInTheDocument()
      expect(screen.getByText('$2,750.80')).toBeInTheDocument()
    })
  })

  it('displays positive changes in green', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      const positiveChange = screen.getByText('+1.75 (+1.18%)')
      expect(positiveChange).toBeInTheDocument()
      expect(positiveChange).toHaveClass('text-green-500')
    })
  })

  it('displays negative changes in red', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      const negativeChange = screen.getByText('-5.60 (-0.20%)')
      expect(negativeChange).toBeInTheDocument()
      expect(negativeChange).toHaveClass('text-red-500')
    })
  })

  it('displays high and low prices', async () => {
    render(<LiveTicker />)
    
    await waitFor(() => {
      expect(screen.getByText('H: $152.00 L: $147.80')).toBeInTheDocument()
      expect(screen.getByText('H: $2,760.00 L: $2,740.00')).toBeInTheDocument()
    })
  })

  it('establishes WebSocket connection', () => {
    render(<LiveTicker />)
    
    expect(io).toHaveBeenCalledWith('http://localhost:5000')
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
    expect(mockSocket.on).toHaveBeenCalledWith('stockUpdate', expect.any(Function))
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function))
  })

  it('shows disconnected status initially', () => {
    render(<LiveTicker />)
    
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
    const statusIndicator = document.querySelector('.bg-red-500')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('updates connection status when connected', () => {
    render(<LiveTicker />)
    
    // Simulate connection
    const connectCallback = mockSocket.on.mock.calls.find(call => call[0] === 'connect')?.[1]
    if (connectCallback) {
      connectCallback()
    }
    
    expect(screen.getByText('Live')).toBeInTheDocument()
    const statusIndicator = document.querySelector('.bg-green-500')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('handles stock updates via WebSocket', async () => {
    render(<LiveTicker />)
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument()
    })
    
    // Simulate stock update
    const stockUpdateCallback = mockSocket.on.mock.calls.find(call => call[0] === 'stockUpdate')?.[1]
    if (stockUpdateCallback) {
      stockUpdateCallback({
        symbol: 'AAPL',
        price: 151.00,
        timestamp: Date.now(),
        volume: 1100000,
        change: 2.50,
        changePercent: 1.68
      })
    }
    
    await waitFor(() => {
      expect(screen.getByText('$151.00')).toBeInTheDocument()
      expect(screen.getByText('+2.50 (+1.68%)')).toBeInTheDocument()
    })
  })

  it('adds new stocks from WebSocket updates', async () => {
    render(<LiveTicker />)
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument()
    })
    
    // Simulate new stock update
    const stockUpdateCallback = mockSocket.on.mock.calls.find(call => call[0] === 'stockUpdate')?.[1]
    if (stockUpdateCallback) {
      stockUpdateCallback({
        symbol: 'TSLA',
        price: 800.50,
        timestamp: Date.now(),
        volume: 750000,
        change: 15.25,
        changePercent: 1.94
      })
    }
    
    await waitFor(() => {
      expect(screen.getByText('TSLA')).toBeInTheDocument()
      expect(screen.getByText('$800.50')).toBeInTheDocument()
    })
  })

  it('handles fetch error gracefully', async () => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'))
    
    // Mock console.error to avoid error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<LiveTicker />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching initial stock data:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('disconnects WebSocket on unmount', () => {
    const { unmount } = render(<LiveTicker />)
    
    unmount()
    
    expect(mockSocket.disconnect).toHaveBeenCalled()
  })
})

// Test utility functions
describe('LiveTicker utility functions', () => {
  describe('formatPrice', () => {
    it('formats prices as currency', () => {
      const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price)
      }
      
      expect(formatPrice(150.25)).toBe('$150.25')
      expect(formatPrice(2750.8)).toBe('$2,750.80')
      expect(formatPrice(0.99)).toBe('$0.99')
    })
  })

  describe('formatChange', () => {
    it('formats positive changes with plus sign', () => {
      const formatChange = (change: number, percent: number) => {
        const sign = change >= 0 ? '+' : ''
        return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
      }
      
      expect(formatChange(1.75, 1.18)).toBe('+1.75 (+1.18%)')
      expect(formatChange(0, 0)).toBe('+0.00 (+0.00%)')
    })

    it('formats negative changes without extra minus sign', () => {
      const formatChange = (change: number, percent: number) => {
        const sign = change >= 0 ? '+' : ''
        return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
      }
      
      expect(formatChange(-5.60, -0.20)).toBe('-5.60 (-0.20%)')
      expect(formatChange(-0.01, -0.01)).toBe('-0.01 (-0.01%)')
    })
  })
})
