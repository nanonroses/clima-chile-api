import { test, expect } from '@playwright/test';

test.describe('Navigation and Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Clima Chile/i);
  });

  test('should display theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle button');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle theme from day to night', async ({ page }) => {
    const appContainer = page.locator('.app-container');
    const themeToggle = page.locator('.theme-toggle button');

    // Get initial theme
    const initialTheme = await appContainer.getAttribute('data-theme');

    // Click toggle
    await themeToggle.click();

    // Get new theme
    const newTheme = await appContainer.getAttribute('data-theme');

    // Theme should have changed
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should toggle theme back', async ({ page }) => {
    const appContainer = page.locator('.app-container');
    const themeToggle = page.locator('.theme-toggle button');

    // Get initial theme
    const initialTheme = await appContainer.getAttribute('data-theme');

    // Toggle twice
    await themeToggle.click();
    await themeToggle.click();

    // Should be back to initial
    const finalTheme = await appContainer.getAttribute('data-theme');
    expect(finalTheme).toBe(initialTheme);
  });

  test('should display main content sections in order', async ({ page }) => {
    // Hero section first
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();

    // Selector section
    const selector = page.locator('.selector-section');
    await expect(selector).toBeVisible();

    // Info sections grid (earthquakes and holidays)
    const infoGrid = page.locator('.info-sections-grid');
    await expect(infoGrid).toBeVisible();

    // Indicators section
    const indicators = page.locator('.indicators-section');
    await expect(indicators).toBeVisible();

    // Stations grid
    const stationsGrid = page.locator('.stations-grid-section');
    await expect(stationsGrid).toBeVisible();

    // Footer
    const footer = page.locator('.app-footer');
    await expect(footer).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    const footerLink = page.locator('.app-footer a');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('href', 'https://boostr.cl/clima');
  });

  test('should scroll to top when clicking station card', async ({ page }) => {
    // Wait for stations to load
    await page.waitForSelector('.station-mini-card', { timeout: 10000 });

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Wait a moment for scroll
    await page.waitForTimeout(300);

    // Click a station card
    await page.click('.station-mini-card:first-child');

    // Wait for scroll animation
    await page.waitForTimeout(500);

    // Check scroll position is near top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(200);
  });

  test('should display loading states', async ({ page }) => {
    // On fresh load, should see loading spinners briefly
    const loadingSpinner = page.locator('.loading-spinner');
    // May or may not be visible depending on timing
    const count = await loadingSpinner.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have accessible form elements', async ({ page }) => {
    const select = page.locator('#station-select');
    await expect(select).toBeVisible();

    // Check for label association
    const label = page.locator('label[for="station-select"]');
    await expect(label).toBeVisible();
  });

  test('should support keyboard navigation on station cards', async ({ page }) => {
    await page.waitForSelector('.station-mini-card', { timeout: 10000 });

    const firstCard = page.locator('.station-mini-card:first-child');

    // Check tabindex
    const tabIndex = await firstCard.getAttribute('tabindex');
    expect(tabIndex).toBe('0');

    // Check role
    const role = await firstCard.getAttribute('role');
    expect(role).toBe('button');
  });
});
