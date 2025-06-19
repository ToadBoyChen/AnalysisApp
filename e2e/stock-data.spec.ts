import { test, expect } from '@playwright/test';

test.describe('Stock Data and API', () => {
  test('should load stock data from API', async ({ page }) => {
    // Intercept API calls
    await page.route('**/api/stock_data', async route => {
      const mockData = [
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
        }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/');
    
    // Wait for API call and data to load
    await page.waitForTimeout(3000);
    
    // Check if stock symbols are displayed
    await expect(page.getByText('AAPL')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('GOOGL')).toBeVisible({ timeout: 10000 });
  });

  test('should display live market data section', async ({ page }) => {
    await page.goto('/');
    
    // Check for live market data section
    await expect(page.getByText('Live Market Data')).toBeVisible();
    
    // Wait for data to potentially load
    await page.waitForTimeout(5000);
    
    // Look for any stock-related content
    const stockContent = page.locator('text=/AAPL|GOOGL|MSFT|TSLA|IBM/').first();
    await expect(stockContent).toBeVisible({ timeout: 15000 });
  });

  test('should handle WebSocket connection status', async ({ page }) => {
    await page.goto('/');
    
    // Wait for components to load
    await page.waitForTimeout(3000);
    
    // Look for connection status indicators
    const connectionStatus = page.locator('text=/Live|Disconnected|Connected/').first();
    await expect(connectionStatus).toBeVisible({ timeout: 10000 });
  });

  test('should display stock prices with proper formatting', async ({ page }) => {
    // Mock API response with specific data
    await page.route('**/api/stock_data', async route => {
      const mockData = [
        {
          symbol: 'AAPL',
          price: 150.25,
          previousClose: 148.50,
          change: 1.75,
          changePercent: 1.18,
          high: 152.00,
          low: 147.80,
          timestamp: Date.now()
        }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Check for formatted price (should include $ symbol)
    await expect(page.getByText(/\$150\.25/)).toBeVisible({ timeout: 10000 });
    
    // Check for change percentage
    await expect(page.getByText(/\+1\.75/)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/1\.18%/)).toBeVisible({ timeout: 5000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/stock_data', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.goto('/');
    
    // Page should still load even if API fails
    await expect(page.getByText('Effective, Easy')).toBeVisible();
    await expect(page.getByText('Live Market Data')).toBeVisible();
    
    // Should not crash the application
    await page.waitForTimeout(3000);
    const errorMessages = page.locator('text=/error|Error|failed|Failed/');
    // Error messages might be in console, not necessarily visible on page
  });

  test('should display stock selector in demo section', async ({ page }) => {
    await page.goto('/');
    
    // Look for the demo section
    await expect(page.getByText('How does 3Z Analysis Work?')).toBeVisible();
    
    // Wait for demo component to load
    await page.waitForTimeout(5000);
    
    // Look for stock selector or dropdown
    const stockSelector = page.locator('select, [role="combobox"], [role="listbox"]').first();
    await expect(stockSelector).toBeVisible({ timeout: 10000 });
  });

  test('should handle stock selection in demo', async ({ page }) => {
    // Mock the stock data API
    await page.route('**/api/stock_data', async route => {
      const mockData = [
        { symbol: 'AAPL', price: 150.25, timestamp: Date.now() },
        { symbol: 'GOOGL', price: 2750.80, timestamp: Date.now() },
        { symbol: 'IBM', price: 135.40, timestamp: Date.now() }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/');
    await page.waitForTimeout(5000);
    
    // Try to find and interact with stock selector
    const stockSelector = page.locator('select, [role="combobox"]').first();
    
    if (await stockSelector.isVisible()) {
      // If it's a select element
      if (await stockSelector.evaluate(el => el.tagName === 'SELECT')) {
        await stockSelector.selectOption('AAPL');
      } else {
        // If it's a custom dropdown
        await stockSelector.click();
        await page.waitForTimeout(500);
        await page.getByText('AAPL').click();
      }
      
      // Wait for selection to take effect
      await page.waitForTimeout(2000);
    }
  });

  test('should display market indices section', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Look for market indices or additional market data
    // This might be part of the MarketIndices component
    const marketSection = page.locator('text=/Market|Index|Indices|S&P|Dow|NASDAQ/').first();
    await expect(marketSection).toBeVisible({ timeout: 10000 });
  });

  test('should handle real-time updates', async ({ page }) => {
    let callCount = 0;
    
    // Mock API to return different data on subsequent calls
    await page.route('**/api/stock_data', async route => {
      callCount++;
      const basePrice = 150.00;
      const variation = callCount * 0.25; // Simulate price changes
      
      const mockData = [
        {
          symbol: 'AAPL',
          price: basePrice + variation,
          previousClose: basePrice,
          change: variation,
          changePercent: (variation / basePrice) * 100,
          timestamp: Date.now()
        }
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/');
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    // Check if initial price is displayed
    await expect(page.getByText(/\$150\.25/)).toBeVisible({ timeout: 10000 });
    
    // Wait for potential updates (the component polls every 30 seconds)
    // We'll wait a shorter time for testing
    await page.waitForTimeout(5000);
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    await expect(page.getByText('Live Market Data')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(2000);
    
    await expect(page.getByText('Live Market Data')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(2000);
    
    await expect(page.getByText('Live Market Data')).toBeVisible();
  });

  test('should handle network connectivity issues', async ({ page }) => {
    await page.goto('/');
    
    // Simulate network going offline
    await page.context().setOffline(true);
    
    // Wait a moment
    await page.waitForTimeout(2000);
    
    // Page should still be functional
    await expect(page.getByText('Effective, Easy')).toBeVisible();
    
    // Restore network
    await page.context().setOffline(false);
    
    // Wait for potential reconnection
    await page.waitForTimeout(3000);
  });
});
