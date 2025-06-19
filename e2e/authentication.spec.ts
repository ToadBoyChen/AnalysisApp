import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign in form correctly', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check page title and description
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByText('Sign in to your 3Z-Analysis account')).toBeVisible();
    
    // Check social sign in buttons
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Apple')).toBeVisible();
    await expect(page.getByText('Continue with Microsoft')).toBeVisible();
    
    // Check form fields
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
    
    // Check form buttons and links
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Forgot your password?')).toBeVisible();
    await expect(page.getByText('Sign up here')).toBeVisible();
  });

  test('should handle form input correctly', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Fill in email
    await page.getByLabel('Email Address').fill('test@example.com');
    await expect(page.getByLabel('Email Address')).toHaveValue('test@example.com');
    
    // Fill in password
    await page.getByLabel('Password').fill('password123');
    await expect(page.getByLabel('Password')).toHaveValue('password123');
    
    // Toggle remember me
    await page.getByLabel('Remember me').check();
    await expect(page.getByLabel('Remember me')).toBeChecked();
    
    await page.getByLabel('Remember me').uncheck();
    await expect(page.getByLabel('Remember me')).not.toBeChecked();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check that email and password are required
    const emailInput = page.getByLabel('Email Address');
    const passwordInput = page.getByLabel('Password');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle form submission', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Fill form
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Remember me').check();
    
    // Listen for console logs to verify form submission
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Submit form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait a moment for console log
    await page.waitForTimeout(500);
    
    // Check if form submission was logged
    const hasFormSubmissionLog = consoleLogs.some(log => 
      log.includes('Sign in form submitted') && 
      log.includes('test@example.com')
    );
    expect(hasFormSubmissionLog).toBeTruthy();
  });

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Navigate to sign up
    await page.getByText('Sign up here').click();
    await expect(page).toHaveURL('/sign-up');
    
    // Navigate back to home
    await page.getByText('← Back to Home').click();
    await expect(page).toHaveURL('/');
  });

  test('should display feature highlights', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check feature highlights on the right side
    await expect(page.getByText('Real-time Market Data')).toBeVisible();
    await expect(page.getByText('Advanced Analytics')).toBeVisible();
    await expect(page.getByText('Portfolio Management')).toBeVisible();
    
    // Check feature descriptions
    await expect(page.getByText('Live stock prices and market updates')).toBeVisible();
    await expect(page.getByText('AI-powered trading insights and predictions')).toBeVisible();
    await expect(page.getByText('Track and manage your investments')).toBeVisible();
  });

  test('should handle social sign in clicks', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Listen for console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Click social sign in buttons
    await page.getByText('Continue with Google').click();
    await page.waitForTimeout(100);
    
    await page.getByText('Continue with Apple').click();
    await page.waitForTimeout(100);
    
    await page.getByText('Continue with Microsoft').click();
    await page.waitForTimeout(100);
    
    // Check if social sign in was logged
    expect(consoleLogs).toContain('Sign in with Google');
    expect(consoleLogs).toContain('Sign in with Apple');
    expect(consoleLogs).toContain('Sign in with Microsoft');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Test tab navigation through form elements
    await page.keyboard.press('Tab'); // Should focus first social button
    await page.keyboard.press('Tab'); // Apple button
    await page.keyboard.press('Tab'); // Microsoft button
    await page.keyboard.press('Tab'); // Email input
    
    // Check that email input is focused
    await expect(page.getByLabel('Email Address')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Password input
    await expect(page.getByLabel('Password')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Remember me checkbox
    await expect(page.getByLabel('Remember me')).toBeFocused();
  });

  test('should display correct image and branding', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check for main image
    const mainImage = page.getByAltText('Trading platform analytics preview');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('src', '/ez-money-home.svg');
    
    // Check welcome message
    await expect(page.getByText('Welcome Back to 3Z-Analysis')).toBeVisible();
    await expect(page.getByText('Continue your trading journey')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/sign-in');
    
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByText('Welcome Back to 3Z-Analysis')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Form should still be visible and functional
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
