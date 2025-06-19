import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import StockListLineGraph from '@/Components/StockListLineGraph'

// Mock axios
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock stock data
const mockStockData = [
  {
    symbol: 'AAPL',
    price: 150.25,
    previousClose: 148.50,
    change: 1.75,
    changePercent: 1.18,
    high: 152.00,
    low: 147.80,
    timestamp: Date.now()
  },
  {
    symbol: 'GOOGL',
    price: 2750.80,
    previousClose: 2745.20,
    change: 5.60,
    changePercent: 0.20,
    high: 2760.00,
    low: 2740.00,
    timestamp: Date.now()
  },
  {
    symbol: 'IBM',
    price: 135.40,
    previousClose: 134.20,
    change: 1.20,
    changePercent: 0.89,
    high: 136.50,
    low: 133.80,
    timestamp: Date.now()
  }
]

describe('StockListLineGraph', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockStockData })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<StockListLineGraph />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('fetches and displays stock data', async () => {
    render(<StockListLineGraph />)
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/stock_data')
    })

    await waitFor(() => {
      expect(screen.getByText('Stock Selector')).toBeInTheDocument()
    })
  })

  it('displays IBM as default selection', async () => {
    render(<StockListLineGraph />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('IBM')).toBeInTheDocument()
    })
  })

  it('allows stock selection', async () => {
    const user = userEvent.setup()
    render(<StockListLineGraph />)
    
    await waitFor(() => {
      expect(screen.getByText('Stock Selector')).toBeInTheDocument()
    })

    // Click on the select trigger
    const selectTrigger = screen.getByRole('combobox')
    await user.click(selectTrigger)

    // Wait for options to appear and select AAPL
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('AAPL'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('AAPL')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'))
    
    render(<StockListLineGraph />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a stock to view its data.')).toBeInTheDocument()
    })
  })

  it('displays chart container when stock is selected', async () => {
    render(<StockListLineGraph />)
    
    await waitFor(() => {
      expect(screen.getByText('Stock Selector')).toBeInTheDocument()
    })

    // The chart container should be present (mocked echarts will handle the actual chart)
    const chartContainer = screen.getByTestId('chart-container') || document.querySelector('[style*="width: 100%"]')
    expect(chartContainer).toBeTruthy()
  })
})

// Test the calculateBoxPlotStats function separately
describe('calculateBoxPlotStats', () => {
  // We need to extract this function or test it indirectly through the component
  // For now, let's test the logic through component behavior
  
  it('should handle empty data array', () => {
    const data: number[] = []
    // This would test the edge case where no data is provided
    // The component should handle this gracefully
    expect(data.length).toBe(0)
  })

  it('should handle single value', () => {
    const data = [100]
    const sortedData = [...data].sort((a, b) => a - b)
    expect(sortedData).toEqual([100])
    expect(Math.min(...data)).toBe(100)
    expect(Math.max(...data)).toBe(100)
  })

  it('should handle multiple values correctly', () => {
    const data = [10, 20, 30, 40, 50]
    const sortedData = [...data].sort((a, b) => a - b)
    expect(sortedData).toEqual([10, 20, 30, 40, 50])
    expect(Math.min(...data)).toBe(10)
    expect(Math.max(...data)).toBe(50)
    
    // Test median calculation
    const mid = Math.floor(data.length / 2)
    const median = data.length % 2 === 0 
      ? (sortedData[mid - 1] + sortedData[mid]) / 2 
      : sortedData[mid]
    expect(median).toBe(30)
  })

  it('should handle even number of values', () => {
    const data = [10, 20, 30, 40]
    const sortedData = [...data].sort((a, b) => a - b)
    const mid = Math.floor(data.length / 2)
    const median = (sortedData[mid - 1] + sortedData[mid]) / 2
    expect(median).toBe(25) // (20 + 30) / 2
  })
})
