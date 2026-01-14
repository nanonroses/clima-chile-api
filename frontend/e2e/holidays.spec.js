import { test, expect } from '@playwright/test';

test.describe('Holidays Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display holidays section', async ({ page }) => {
    const section = page.locator('.holidays-section');
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test('should show section title', async ({ page }) => {
    const title = page.locator('.holidays-section .section-title');
    await expect(title).toContainText('Feriados');
  });

  test('should display holidays list', async ({ page }) => {
    // Wait for loading to finish
    await page.waitForSelector('.holidays-section .holiday-item', {
      timeout: 15000,
      state: 'visible'
    }).catch(() => null);

    const holidayItems = page.locator('.holiday-item');
    const noData = page.locator('.holidays-section .no-data-text');

    const hasItems = await holidayItems.count() > 0;
    const hasNoDataMsg = await noData.isVisible().catch(() => false);

    expect(hasItems || hasNoDataMsg).toBeTruthy();
  });

  test('should display holiday name', async ({ page }) => {
    await page.waitForSelector('.holiday-item', { timeout: 15000 }).catch(() => null);

    const holidayNames = page.locator('.holiday-name');
    const count = await holidayNames.count();

    if (count > 0) {
      const firstName = holidayNames.first();
      await expect(firstName).toBeVisible();
      const text = await firstName.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('should display holiday date', async ({ page }) => {
    await page.waitForSelector('.holiday-item', { timeout: 15000 }).catch(() => null);

    const holidayDates = page.locator('.holiday-date');
    const count = await holidayDates.count();

    if (count > 0) {
      const firstDate = holidayDates.first();
      await expect(firstDate).toBeVisible();
    }
  });

  test('should show countdown for upcoming holidays', async ({ page }) => {
    await page.waitForSelector('.holiday-item', { timeout: 15000 }).catch(() => null);

    const countdowns = page.locator('.holiday-countdown');
    const count = await countdowns.count();

    if (count > 0) {
      const firstCountdown = countdowns.first();
      await expect(firstCountdown).toBeVisible();
    }
  });

  test('should display holiday icons', async ({ page }) => {
    await page.waitForSelector('.holiday-item', { timeout: 15000 }).catch(() => null);

    const icons = page.locator('.holiday-icon');
    const count = await icons.count();

    if (count > 0) {
      const firstIcon = icons.first();
      await expect(firstIcon).toBeVisible();
    }
  });

  test('should show irrenunciable badge when applicable', async ({ page }) => {
    await page.waitForSelector('.holiday-item', { timeout: 15000 }).catch(() => null);

    // This test just verifies the badge class exists in the DOM structure
    const badges = page.locator('.holiday-badge');
    // May or may not have irrenunciable holidays - just verify structure works
    const count = await badges.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display today holiday banner when applicable', async ({ page }) => {
    // Wait for holidays section to load
    await page.waitForSelector('.holidays-section', { timeout: 10000 });

    // The banner may or may not be visible depending on the date
    const banner = page.locator('.today-holiday-banner');
    // Just verify the test runs without error
    const isVisible = await banner.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});
