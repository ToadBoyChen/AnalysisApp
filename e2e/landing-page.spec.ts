import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByText('Effective, Easy')).toBeVisible();
    await expect(page.getByText('Trading Platform')).toBeVisible();
    await expect(page.getByText('Free, Open Source and Secure')).toBeVisible();
  });

  test('should display navigation buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check authentication buttons
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Guest' })).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByText('Create Your Account')).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Log In' }).click();
    await expect(page).toHaveURL('/sign-in');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('should navigate to guest home page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Guest' }).click();
    await expect(page).toHaveURL('/home');
  });

  test('should display live market data section', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the live ticker to load
    await expect(page.getByText('Live Market Data')).toBeVisible();
    
    // Check if stock data is displayed (may take a moment to load)
    await page.waitForTimeout(2000);
    
    // Look for stock symbols or price indicators
    const stockElements = page.locator('[class*="stock"], [class*="ticker"], [class*="price"]');
    await expect(stockElements.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display technology stack section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Thank you')).toBeVisible();
    
    // Check technology links
    await expect(page.getByRole('link', { name: 'React' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Next.js' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tailwind CSS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shadcn UI' })).toBeVisible();
  });

  test('should have working external links', async ({ page }) => {
    await page.goto('/');
    
    // Test React link (check href attribute)
    const reactLink = page.getByRole('link', { name: 'React' });
    await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    await expect(reactLink).toHaveAttribute('target', '_blank');
    
    // Test Next.js link
    const nextLink = page.getByRole('link', { name: 'Next.js' });
    await expect(nextLink).toHaveAttribute('href', 'https://nextjs.org');
    await expect(nextLink).toHaveAttribute('target', '_blank');
  });

  test('should display stock demo component', async ({ page }) => {
    await page.goto('/');
    
    // Look for stock selector or demo component
    await expect(page.getByText('How does 3Z Analysis Work?')).toBeVisible();
    
    // Wait for demo component to load
    await page.waitForTimeout(3000);
    
    // Check if there's a stock selector or chart
    const demoSection = page.locator('text="How does 3Z Analysis Work?"').locator('..').locator('..');
    await expect(demoSection).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main content is still visible
    await expect(page.getByText('Effective, Easy')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
    
    // Check that layout adapts to mobile
    const mainContainer = page.locator('section').first();
    await expect(mainContainer).toBeVisible();
  });
});
