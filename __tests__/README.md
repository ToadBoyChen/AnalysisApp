# Testing Guide for 3Z-Analysis

This directory contains comprehensive unit tests for the 3Z-Analysis trading platform. The tests are organized by component type and functionality.

## Test Structure

```
__tests__/
├── lib/                    # Utility function tests
│   └── utils.test.ts      # Tests for utility functions
├── Components/            # Component tests
│   ├── ui/               # UI component tests
│   │   └── button.test.tsx
│   ├── StockListLineGraph.test.tsx
│   └── LiveTicker.test.tsx
├── app/                  # Page component tests
│   └── sign-in.test.tsx
└── README.md            # This file
```

## Test Categories

### 1. Utility Functions (`lib/utils.test.ts`)
- **cn() function**: Tests class name merging with Tailwind CSS
- **Edge cases**: Empty inputs, conditional classes, conflicts
- **Type safety**: Handles various input types (strings, arrays, objects)

### 2. Stock Components

#### StockListLineGraph (`Components/StockListLineGraph.test.tsx`)
- **Data fetching**: API calls and error handling
- **Stock selection**: Dropdown functionality and state management
- **Chart rendering**: ECharts integration (mocked)
- **Box plot calculations**: Statistical calculations for stock data
- **Real-time updates**: Polling mechanism testing

#### LiveTicker (`Components/LiveTicker.test.tsx`)
- **WebSocket connections**: Real-time data streaming
- **Price formatting**: Currency and percentage display
- **Stock updates**: Adding and updating stock data
- **Connection status**: Live/disconnected indicators
- **Error handling**: Network failures and recovery

### 3. Authentication (`app/sign-in.test.tsx`)
- **Form validation**: Required fields and input types
- **User interactions**: Form submission and social login
- **State management**: Form data handling
- **Navigation**: Links and routing
- **Accessibility**: ARIA attributes and keyboard navigation

### 4. UI Components (`Components/ui/button.test.tsx`)
- **Variants**: Different button styles (default, outline, ghost, etc.)
- **Sizes**: Various button sizes (sm, default, lg, icon)
- **Interactions**: Click events and keyboard navigation
- **Accessibility**: Focus management and ARIA support
- **Ref forwarding**: React ref handling

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run utility tests only
npm test -- utils.test.ts

# Run component tests only
npm test -- Components/

# Run a specific test suite
npm test -- StockListLineGraph.test.tsx
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- **Environment**: jsdom for DOM testing
- **Module mapping**: Path aliases (@/ -> root directory)
- **Coverage thresholds**: 70% minimum coverage
- **Setup files**: Custom test setup and mocks

### Test Setup (`jest.setup.js`)
- **Global mocks**: Next.js router, Image component, ECharts, Socket.IO
- **DOM APIs**: ResizeObserver, IntersectionObserver, matchMedia
- **Testing utilities**: Extended matchers from @testing-library/jest-dom

## Mocking Strategy

### External Dependencies
- **axios**: HTTP requests mocked with jest.mock()
- **socket.io-client**: WebSocket connections mocked
- **echarts**: Chart library mocked for rendering tests
- **Next.js**: Router and Image component mocked

### API Responses
- **Stock data**: Realistic mock data for testing
- **Error scenarios**: Network failures and API errors
- **WebSocket events**: Simulated real-time updates

## Coverage Goals

The test suite aims for:
- **70% minimum coverage** across all metrics
- **Critical path testing**: Core functionality fully tested
- **Edge case handling**: Error scenarios and boundary conditions
- **User interaction testing**: Complete user workflows

## Key Testing Patterns

### 1. Component Rendering
```typescript
it('renders component correctly', () => {
  render(<Component />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### 2. User Interactions
```typescript
it('handles user input', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  await user.click(screen.getByRole('button'))
  expect(mockFunction).toHaveBeenCalled()
})
```

### 3. Async Operations
```typescript
it('handles async data loading', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument()
  })
})
```

### 4. Error Handling
```typescript
it('handles errors gracefully', async () => {
  mockAPI.mockRejectedValue(new Error('API Error'))
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Error Message')).toBeInTheDocument()
  })
})
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mock Management
- Clear mocks between tests
- Use realistic mock data
- Mock at the appropriate level

### 3. Accessibility Testing
- Test keyboard navigation
- Verify ARIA attributes
- Check focus management

### 4. Performance Considerations
- Mock heavy dependencies
- Use efficient queries
- Avoid unnecessary re-renders

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- **Fast execution**: Optimized for quick feedback
- **Reliable**: Consistent results across environments
- **Comprehensive**: Covers critical functionality

## Future Enhancements

Potential test improvements:
- **E2E tests**: Full user journey testing
- **Visual regression**: Screenshot comparisons
- **Performance tests**: Load and stress testing
- **Integration tests**: Multi-component workflows
