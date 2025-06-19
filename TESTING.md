# Complete Testing Guide for 3Z-Analysis

This document provides a comprehensive overview of all testing capabilities in the 3Z-Analysis trading platform.

## 📋 Test Types Overview

The project includes two types of tests:

1. **Unit Tests** (Jest + React Testing Library) - Test individual components and functions
2. **End-to-End Tests** (Playwright) - Test complete user workflows across browsers

## 🚀 Quick Start Commands

### Local Testing (Node.js Required)

#### Run ALL Tests (Recommended)
```bash
# Run both unit tests and E2E tests
npm run test:all

# Run all tests with coverage report
npm run test:all:coverage
```

### Docker Testing (No Node.js Required) 🐳

#### Docker Setup (Arch Linux)
```bash
# Install and start Docker
sudo pacman -S docker
sudo systemctl start docker
sudo usermod -aG docker $USER
# Logout and login again for group changes
```

#### Quick Docker Setup
```bash
# Build Docker image and run all tests
./build_docker.sh 3z-analysis
docker run -t 3z-analysis ./run_tests.sh all
```

#### Docker Test Commands
```bash
# Unit tests only
docker run -t 3z-analysis ./run_tests.sh unit

# E2E tests only  
docker run -t 3z-analysis ./run_tests.sh e2e

# All tests
docker run -t 3z-analysis ./run_tests.sh all
```

> 📖 **For detailed Docker testing guide, see [DOCKER_TESTING.md](./DOCKER_TESTING.md)**

#### Docker Troubleshooting
```bash
# If Docker daemon not running:
sudo systemctl start docker

# If permission denied:
sudo usermod -aG docker $USER
# Then logout and login again

# Verify Docker works:
docker --version
docker info
```

### Run Specific Test Types

#### Unit Tests Only
```bash
# Run Jest unit tests once
npm test

# Run Jest tests in watch mode (re-runs on file changes)
npm run test:watch

# Run Jest tests with coverage report
npm run test:coverage
```

#### E2E Tests Only
```bash
# Run Playwright E2E tests
npm run test:e2e

# Run E2E tests with interactive UI
npm run test:e2e:ui

# Run E2E tests in visible browser (headed mode)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug
```

## 📁 Test Structure

```
3Z-Analysis/
├── __tests__/                    # Unit tests (Jest)
│   ├── Components/
│   │   ├── ui/
│   │   │   └── button.test.tsx
│   │   ├── LiveTicker.test.tsx
│   │   └── StockListLineGraph.test.tsx
│   ├── app/
│   │   ├── page.test.tsx
│   │   └── sign-in.test.tsx
│   ├── lib/
│   │   └── utils.test.ts
│   └── README.md
├── e2e/                          # E2E tests (Playwright)
│   ├── landing-page.spec.ts
│   ├── authentication.spec.ts
│   ├── stock-data.spec.ts
│   └── README.md
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Jest setup file
├── playwright.config.ts          # Playwright configuration
└── TESTING.md                    # This file
```

## 🧪 Unit Tests (Jest)

### What They Test
- **Components**: React component rendering and behavior
- **Utilities**: Helper functions and business logic
- **User Interactions**: Button clicks, form submissions, etc.
- **Props & State**: Component props handling and state changes

### Key Features
- **Fast Execution**: Runs in milliseconds
- **Isolated Testing**: Each test runs independently
- **Mocking**: Mock external dependencies and APIs
- **Coverage Reports**: See which code is tested
- **Watch Mode**: Auto-rerun tests on file changes

### Test Files
- `__tests__/app/page.test.tsx` - Landing page component tests
- `__tests__/app/sign-in.test.tsx` - Sign-in page component tests
- `__tests__/Components/LiveTicker.test.tsx` - Live ticker component tests
- `__tests__/Components/StockListLineGraph.test.tsx` - Stock chart component tests
- `__tests__/Components/ui/button.test.tsx` - Button component tests
- `__tests__/lib/utils.test.ts` - Utility function tests

### Example Unit Test
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/Components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 🌐 End-to-End Tests (Playwright)

### What They Test
- **Complete User Flows**: Full authentication, navigation, data interaction
- **Cross-Browser Compatibility**: Chrome, Firefox, Safari
- **Mobile Responsiveness**: Different screen sizes and devices
- **API Integration**: Real API calls and WebSocket connections
- **Performance**: Page load times and user experience

### Key Features
- **Multi-Browser**: Tests run on Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12 viewports
- **API Mocking**: Intercept and mock API responses
- **Visual Debugging**: Screenshots, videos, traces
- **Real User Simulation**: Actual browser interactions

### Test Files
- `e2e/landing-page.spec.ts` - Landing page functionality (10 tests)
- `e2e/authentication.spec.ts` - Sign-in/sign-up flows (10 tests)
- `e2e/stock-data.spec.ts` - Stock data and API testing (11 tests)

### Example E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('should navigate to sign up page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL('/sign-up');
});
```

## 🔧 Configuration Files

### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // ... more config
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // ... more browsers
  ],
})
```

## 📊 Test Coverage

### Unit Test Coverage
Run `npm run test:coverage` to see:
- **Statements**: % of code statements executed
- **Branches**: % of code branches taken
- **Functions**: % of functions called
- **Lines**: % of lines executed

### E2E Test Coverage
E2E tests cover:
- ✅ 31 test cases across 3 main user flows
- ✅ 5 different browsers/devices
- ✅ API mocking and error scenarios
- ✅ Responsive design validation
- ✅ Accessibility testing

## 🐛 Debugging Tests

### Unit Test Debugging
```bash
# Run specific test file
npm test -- page.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="button"

# Run with verbose output
npm test -- --verbose
```

### E2E Test Debugging
```bash
# Debug specific test
npx playwright test --debug landing-page.spec.ts

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (visible browser)
npm run test:e2e:headed

# Generate trace files
npx playwright test --trace=on
```

## 🚨 Common Issues & Solutions

### Unit Tests
1. **Import Errors**: Ensure proper module resolution in `jest.config.js`
2. **Component Not Rendering**: Check if all required props are provided
3. **Async Operations**: Use `waitFor` for async state changes

### E2E Tests
1. **Browser Installation**: Run `npx playwright install`
2. **Port Conflicts**: Ensure port 3000 is available
3. **Timeout Issues**: Increase timeouts for slow operations
4. **Flaky Tests**: Add proper waits for dynamic content

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Unit Tests
      - run: npm ci
      - run: npm run test:coverage
      
      # E2E Tests
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      # Upload Results
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: |
            coverage/
            playwright-report/
```

## 📈 Best Practices

### Unit Tests
1. **Test Behavior, Not Implementation**: Focus on what the component does
2. **Use Descriptive Names**: Clear test descriptions
3. **Keep Tests Simple**: One assertion per test when possible
4. **Mock External Dependencies**: Isolate component under test

### E2E Tests
1. **Test User Journeys**: Complete workflows, not individual functions
2. **Use Semantic Selectors**: Prefer `getByRole`, `getByLabel` over CSS selectors
3. **Handle Async Operations**: Proper waits for dynamic content
4. **Test Across Browsers**: Ensure cross-browser compatibility

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 Test Strategy Summary

| Test Type | Purpose | Speed | Coverage | When to Use |
|-----------|---------|-------|----------|-------------|
| **Unit** | Component logic | Fast | High | During development |
| **E2E** | User workflows | Slower | Broad | Before releases |

**Recommended Workflow:**
1. Write unit tests during development
2. Run `npm run test:watch` while coding
3. Run `npm run test:all` before commits
4. Use E2E tests for critical user paths
5. Run full test suite in CI/CD pipeline

This comprehensive testing strategy ensures your trading platform is reliable, user-friendly, and works consistently across all browsers and devices! 🚀
