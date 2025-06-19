# End-to-End Testing Guide for 3Z-Analysis

This directory contains Playwright end-to-end tests for the 3Z-Analysis trading platform. These tests verify the complete user experience across different browsers and devices.

## Test Structure

```
e2e/
├── landing-page.spec.ts      # Landing page functionality
├── authentication.spec.ts    # Sign-in/sign-up flows
├── stock-data.spec.ts        # Stock data and API testing
└── README.md                # This file
```

## Test Categories

### 1. Landing Page Tests (`landing-page.spec.ts`)

**Core Functionality:**
- Page loading and main content display
- Navigation button functionality
- Technology stack section
- External link validation
- Responsive design testing
- Stock demo component interaction

**Key Test Cases:**
- ✅ Main heading and branding display
- ✅ Authentication button navigation
- ✅ Live market data section
- ✅ Technology links and external navigation
- ✅ Mobile responsiveness

### 2. Authentication Tests (`authentication.spec.ts`)

**Core Functionality:**
- Sign-in form validation and submission
- Social authentication buttons
- Form input handling and validation
- Navigation between auth pages
- Accessibility and keyboard navigation

**Key Test Cases:**
- ✅ Form field validation (email, password, required fields)
- ✅ Social sign-in button interactions
- ✅ Form submission with console log verification
- ✅ Navigation between sign-in/sign-up pages
- ✅ Keyboard accessibility testing
- ✅ Responsive design across devices

### 3. Stock Data & API Tests (`stock-data.spec.ts`)

**Core Functionality:**
- API data loading and display
- WebSocket connection status
- Real-time data updates
- Error handling and resilience
- Stock selection and interaction

**Key Test Cases:**
- ✅ API mocking and data display
- ✅ Price formatting and change indicators
- ✅ Connection status indicators
- ✅ Error handling for API failures
- ✅ Stock selector functionality
- ✅ Network connectivity resilience

## Running E2E Tests

### Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers:**
   ```bash
   npx playwright install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

### Test Execution Commands

#### Run All E2E Tests
```bash
npm run test:e2e
```

#### Run Tests with UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

#### Run Tests in Headed Mode (Visible Browser)
```bash
npm run test:e2e:headed
```

#### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```

#### Run Specific Test File
```bash
npx playwright test landing-page.spec.ts
```

#### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Multiple Browsers:** Chromium, Firefox, WebKit
- **Mobile Testing:** Pixel 5, iPhone 12 viewports
- **Automatic Server:** Starts dev server before tests
- **Trace Collection:** On test failure for debugging
- **HTML Reports:** Generated after test runs

## Test Features

### 1. API Mocking

Tests use Playwright's route interception to mock API responses:

```typescript
await page.route('**/api/stock_data', async route => {
  const mockData = [
    { symbol: 'AAPL', price: 150.25, /* ... */ }
  ];
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockData)
  });
});
```

### 2. Real-time Testing

Tests verify WebSocket connections and real-time updates:
- Connection status indicators
- Live data streaming
- Reconnection handling

### 3. Responsive Design

Tests validate functionality across different screen sizes:
- Desktop (1200x800)
- Tablet (768x1024)
- Mobile (375x667)

### 4. Accessibility Testing

Tests include keyboard navigation and ARIA compliance:
- Tab navigation through forms
- Focus management
- Screen reader compatibility

### 5. Error Handling

Tests verify graceful degradation:
- API failures
- Network connectivity issues
- Invalid data handling

## Browser Support

Tests run on multiple browsers to ensure cross-browser compatibility:

| Browser | Version | Status |
|---------|---------|--------|
| Chromium | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| WebKit (Safari) | Latest | ✅ Supported |
| Mobile Chrome | Latest | ✅ Supported |
| Mobile Safari | Latest | ✅ Supported |

## Test Data Management

### Mock Data Strategy

1. **Consistent Data:** Use realistic stock symbols and prices
2. **Edge Cases:** Test with various data scenarios
3. **Error Scenarios:** Mock API failures and network issues
4. **Real-time Simulation:** Dynamic data changes over time

### Environment Variables

Tests can use environment variables for configuration:
- `CI`: Enables CI-specific settings
- `PLAYWRIGHT_BASE_URL`: Override base URL for testing

## Debugging Tests

### Visual Debugging

1. **UI Mode:** Interactive test runner with step-by-step execution
2. **Headed Mode:** Watch tests run in real browser
3. **Screenshots:** Automatic capture on failures
4. **Video Recording:** Full test session recording

### Debug Commands

```bash
# Debug specific test
npx playwright test --debug landing-page.spec.ts

# Run with browser developer tools
npx playwright test --headed --slowMo=1000

# Generate trace for failed tests
npx playwright test --trace=on
```

### Trace Viewer

View detailed test execution traces:
```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

Tests are designed for continuous integration:

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and atomic

### 2. Selectors
- Prefer semantic selectors (role, label, text)
- Avoid brittle CSS selectors
- Use data-testid for complex components

### 3. Assertions
- Use specific assertions with timeouts
- Test user-visible behavior
- Verify both positive and negative cases

### 4. Performance
- Use efficient waiting strategies
- Mock external dependencies
- Parallelize test execution

## Troubleshooting

### Common Issues

1. **Browser Installation:**
   ```bash
   npx playwright install --with-deps
   ```

2. **Port Conflicts:**
   - Ensure port 3000 is available
   - Check for running dev servers

3. **Timeout Issues:**
   - Increase timeout for slow operations
   - Use proper wait strategies

4. **Flaky Tests:**
   - Add proper waits for dynamic content
   - Use retry mechanisms
   - Mock time-dependent operations

### System Dependencies

If you encounter missing system dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

# Or use Playwright's install command
npx playwright install-deps
```

## Reporting

### HTML Reports

After test execution, view detailed reports:
```bash
npx playwright show-report
```

### Test Results

Reports include:
- Test execution summary
- Screenshots of failures
- Performance metrics
- Cross-browser comparison

## Future Enhancements

Potential test improvements:
- **Visual Regression:** Screenshot comparisons
- **Performance Testing:** Core Web Vitals monitoring
- **Accessibility Audits:** Automated a11y testing
- **API Contract Testing:** Schema validation
- **Load Testing:** Concurrent user simulation

## Contributing

When adding new E2E tests:

1. Follow existing naming conventions
2. Add comprehensive test coverage
3. Include both positive and negative scenarios
4. Update this documentation
5. Ensure tests pass in all browsers
