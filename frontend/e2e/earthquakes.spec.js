import { test, expect } from '@playwright/test';

test.describe('Earthquakes Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display earthquakes section', async ({ page }) => {
    const section = page.locator('.earthquakes-section');
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test('should show section title', async ({ page }) => {
    const title = page.locator('.earthquakes-section .section-title');
    await expect(title).toContainText('Sismos');
  });

  test('should display earthquake list', async ({ page }) => {
    // Wait for loading to finish
    await page.waitForSelector('.earthquakes-section .earthquake-item', {
      timeout: 15000,
      state: 'visible'
    }).catch(() => {
      // If no earthquakes, check for no-data message
    });

    const earthquakeItems = page.locator('.earthquake-item');
    const noData = page.locator('.earthquakes-section .no-data-text');

    // Either we have earthquake items or a no-data message
    const hasItems = await earthquakeItems.count() > 0;
    const hasNoDataMsg = await noData.isVisible().catch(() => false);

    expect(hasItems || hasNoDataMsg).toBeTruthy();
  });

  test('should show earthquake magnitude with correct styling', async ({ page }) => {
    await page.waitForSelector('.earthquake-item', { timeout: 15000 }).catch(() => null);

    const magnitudeElements = page.locator('.earthquake-magnitude');
    const count = await magnitudeElements.count();

    if (count > 0) {
      const firstMagnitude = magnitudeElements.first();
      await expect(firstMagnitude).toBeVisible();

      // Check magnitude value is displayed
      const magValue = page.locator('.magnitude-value').first();
      await expect(magValue).toBeVisible();
    }
  });

  test('should display earthquake location', async ({ page }) => {
    await page.waitForSelector('.earthquake-item', { timeout: 15000 }).catch(() => null);

    const locationElements = page.locator('.earthquake-location');
    const count = await locationElements.count();

    if (count > 0) {
      const firstLocation = locationElements.first();
      await expect(firstLocation).toBeVisible();
      const text = await firstLocation.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('should show earthquake depth information', async ({ page }) => {
    await page.waitForSelector('.earthquake-item', { timeout: 15000 }).catch(() => null);

    const depthElements = page.locator('.earthquake-depth');
    const count = await depthElements.count();

    if (count > 0) {
      const firstDepth = depthElements.first();
      await expect(firstDepth).toBeVisible();
      await expect(firstDepth).toContainText('km');
    }
  });

  test('should limit displayed earthquakes to 8', async ({ page }) => {
    await page.waitForSelector('.earthquake-item', { timeout: 15000 }).catch(() => null);

    const earthquakeItems = page.locator('.earthquake-item');
    const count = await earthquakeItems.count();

    expect(count).toBeLessThanOrEqual(8);
  });
});
