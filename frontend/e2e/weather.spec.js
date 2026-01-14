import { test, expect } from '@playwright/test';

test.describe('Weather Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section with title', async ({ page }) => {
    const title = page.locator('.hero-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Clima Chile');
  });

  test('should display station selector dropdown', async ({ page }) => {
    const selector = page.locator('#station-select');
    await expect(selector).toBeVisible();
  });

  test('should have all Chilean weather stations in dropdown', async ({ page }) => {
    const options = page.locator('#station-select option');
    const count = await options.count();
    // 25 stations + 1 default option
    expect(count).toBeGreaterThanOrEqual(26);
  });

  test('should select a station and show weather data', async ({ page }) => {
    // Select Santiago
    await page.selectOption('#station-select', 'SCQN');

    // Click consult button
    await page.click('.consult-button');

    // Wait for weather card to appear
    const weatherCard = page.locator('.weather-card');
    await expect(weatherCard).toBeVisible({ timeout: 10000 });

    // Verify city name is displayed
    const cityName = page.locator('.weather-city h2');
    await expect(cityName).toContainText('Santiago');
  });

  test('should display all stations grid', async ({ page }) => {
    const stationsGrid = page.locator('.stations-grid');
    await expect(stationsGrid).toBeVisible({ timeout: 10000 });

    // Check that mini cards are loaded
    const miniCards = page.locator('.station-mini-card');
    const count = await miniCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should click on a station card and show details', async ({ page }) => {
    // Wait for stations to load
    await page.waitForSelector('.station-mini-card', { timeout: 10000 });

    // Click first station card
    await page.click('.station-mini-card:first-child');

    // Weather card should appear
    const weatherCard = page.locator('.weather-card');
    await expect(weatherCard).toBeVisible({ timeout: 5000 });
  });

  test('should display temperature in weather card', async ({ page }) => {
    // Select a station
    await page.selectOption('#station-select', 'SCEL');
    await page.click('.consult-button');

    // Wait for and verify temperature display
    const tempValue = page.locator('.temp-value');
    await expect(tempValue).toBeVisible({ timeout: 10000 });
  });

  test('should display weather details (humidity, feels like)', async ({ page }) => {
    await page.selectOption('#station-select', 'SCQN');
    await page.click('.consult-button');

    // Wait for details
    const details = page.locator('.weather-details');
    await expect(details).toBeVisible({ timeout: 10000 });

    // Check detail items exist
    const detailItems = page.locator('.detail-item');
    const count = await detailItems.count();
    expect(count).toBe(3);
  });
});
