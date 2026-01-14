import { test, expect } from '@playwright/test';

test.describe('Economic Indicators Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display indicators section', async ({ page }) => {
    const section = page.locator('.indicators-section');
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test('should show section title', async ({ page }) => {
    const title = page.locator('.indicators-section .section-title');
    await expect(title).toContainText('Indicadores');
  });

  test('should display indicators grid', async ({ page }) => {
    await page.waitForSelector('.indicators-grid', { timeout: 15000 });
    const grid = page.locator('.indicators-grid');
    await expect(grid).toBeVisible();
  });

  test('should display all 5 economic indicators', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorCards = page.locator('.indicator-card');
    const count = await indicatorCards.count();

    // Should have: Dólar, Euro, UF, UTM, IPC
    expect(count).toBe(5);
  });

  test('should display Dólar indicator', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorNames = page.locator('.indicator-name');
    const texts = await indicatorNames.allTextContents();

    expect(texts.some(t => t.includes('Dólar'))).toBeTruthy();
  });

  test('should display Euro indicator', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorNames = page.locator('.indicator-name');
    const texts = await indicatorNames.allTextContents();

    expect(texts.some(t => t.includes('Euro'))).toBeTruthy();
  });

  test('should display UF indicator', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorNames = page.locator('.indicator-name');
    const texts = await indicatorNames.allTextContents();

    expect(texts.some(t => t.includes('UF'))).toBeTruthy();
  });

  test('should display UTM indicator', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorNames = page.locator('.indicator-name');
    const texts = await indicatorNames.allTextContents();

    expect(texts.some(t => t.includes('UTM'))).toBeTruthy();
  });

  test('should display IPC indicator', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const indicatorNames = page.locator('.indicator-name');
    const texts = await indicatorNames.allTextContents();

    expect(texts.some(t => t.includes('IPC'))).toBeTruthy();
  });

  test('should show indicator values', async ({ page }) => {
    await page.waitForSelector('.indicator-value', { timeout: 15000 });

    const values = page.locator('.indicator-value');
    const count = await values.count();

    expect(count).toBe(5);

    // Check first value is visible
    const firstValue = values.first();
    await expect(firstValue).toBeVisible();
  });

  test('should display indicator icons', async ({ page }) => {
    await page.waitForSelector('.indicator-icon', { timeout: 15000 });

    const icons = page.locator('.indicator-icon');
    const count = await icons.count();

    expect(count).toBe(5);
  });
});
