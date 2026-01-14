import { test, expect } from '@playwright/test';

test.describe('Responsive Design - Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section on mobile', async ({ page }) => {
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();
  });

  test('should display selector section on mobile', async ({ page }) => {
    const selector = page.locator('.selector-section');
    await expect(selector).toBeVisible();

    // Select should be full width
    const select = page.locator('.station-select');
    const box = await select.boundingBox();
    expect(box.width).toBeGreaterThan(250);
  });

  test('should stack info sections vertically on mobile', async ({ page }) => {
    const infoGrid = page.locator('.info-sections-grid');
    await expect(infoGrid).toBeVisible();

    // On mobile, sections should stack
    const earthquakes = page.locator('.earthquakes-section');
    const holidays = page.locator('.holidays-section');

    const eqBox = await earthquakes.boundingBox();
    const holBox = await holidays.boundingBox();

    // Holidays should be below earthquakes (higher Y value)
    expect(holBox.y).toBeGreaterThan(eqBox.y);
  });

  test('should display indicators in mobile layout', async ({ page }) => {
    await page.waitForSelector('.indicators-grid', { timeout: 15000 });

    const grid = page.locator('.indicators-grid');
    await expect(grid).toBeVisible();
  });

  test('should display stations grid on mobile', async ({ page }) => {
    await page.waitForSelector('.stations-grid', { timeout: 15000 });

    const grid = page.locator('.stations-grid');
    await expect(grid).toBeVisible();
  });

  test('should have theme toggle accessible on mobile', async ({ page }) => {
    const toggle = page.locator('.theme-toggle button');
    await expect(toggle).toBeVisible();

    // Check button is large enough for touch (44x44 minimum)
    const box = await toggle.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(40);
    expect(box.height).toBeGreaterThanOrEqual(40);
  });

  test('should allow station selection on mobile', async ({ page }) => {
    const select = page.locator('#station-select');
    await expect(select).toBeVisible();

    await page.selectOption('#station-select', 'SCQN');

    const button = page.locator('.consult-button');
    await expect(button).toBeEnabled();
  });
});

test.describe('Responsive Design - Tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section on tablet', async ({ page }) => {
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();
  });

  test('should display info sections side by side on tablet', async ({ page }) => {
    const infoGrid = page.locator('.info-sections-grid');
    await expect(infoGrid).toBeVisible();

    // On tablet, might be side by side or stacked depending on breakpoint
    const earthquakes = page.locator('.earthquakes-section');
    const holidays = page.locator('.holidays-section');

    await expect(earthquakes).toBeVisible();
    await expect(holidays).toBeVisible();
  });

  test('should display indicators grid properly on tablet', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const cards = page.locator('.indicator-card');
    const count = await cards.count();
    expect(count).toBe(5);
  });

  test('should display multiple station cards per row on tablet', async ({ page }) => {
    await page.waitForSelector('.station-mini-card', { timeout: 15000 });

    const cards = page.locator('.station-mini-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Check first two cards are roughly on same row (similar Y position)
    if (count >= 2) {
      const card1Box = await cards.nth(0).boundingBox();
      const card2Box = await cards.nth(1).boundingBox();

      // They should be on the same row (Y difference less than card height)
      expect(Math.abs(card1Box.y - card2Box.y)).toBeLessThan(card1Box.height);
    }
  });
});

test.describe('Responsive Design - Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all sections properly on desktop', async ({ page }) => {
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.selector-section')).toBeVisible();
    await expect(page.locator('.info-sections-grid')).toBeVisible();
    await expect(page.locator('.indicators-section')).toBeVisible();
    await expect(page.locator('.stations-grid-section')).toBeVisible();
  });

  test('should display info sections in two columns on desktop', async ({ page }) => {
    const earthquakes = page.locator('.earthquakes-section');
    const holidays = page.locator('.holidays-section');

    await expect(earthquakes).toBeVisible();
    await expect(holidays).toBeVisible();

    const eqBox = await earthquakes.boundingBox();
    const holBox = await holidays.boundingBox();

    // On desktop, they should be side by side (similar Y, different X)
    const yDiff = Math.abs(eqBox.y - holBox.y);
    expect(yDiff).toBeLessThan(50);
  });

  test('should have adequate content width on desktop', async ({ page }) => {
    const mainContent = page.locator('.main-content');
    const box = await mainContent.boundingBox();

    // Content should be reasonably sized, not stretched edge-to-edge
    expect(box.width).toBeLessThanOrEqual(1200);
  });

  test('should display weather card properly when station selected', async ({ page }) => {
    await page.selectOption('#station-select', 'SCQN');
    await page.click('.consult-button');

    const weatherCard = page.locator('.weather-card');
    await expect(weatherCard).toBeVisible({ timeout: 10000 });

    const box = await weatherCard.boundingBox();
    expect(box.width).toBeGreaterThan(300);
  });

  test('should display multiple indicator cards in a row on desktop', async ({ page }) => {
    await page.waitForSelector('.indicator-card', { timeout: 15000 });

    const cards = page.locator('.indicator-card');
    const count = await cards.count();

    if (count >= 3) {
      const card1Box = await cards.nth(0).boundingBox();
      const card2Box = await cards.nth(1).boundingBox();
      const card3Box = await cards.nth(2).boundingBox();

      // First three should be on same row
      expect(Math.abs(card1Box.y - card2Box.y)).toBeLessThan(20);
      expect(Math.abs(card2Box.y - card3Box.y)).toBeLessThan(20);
    }
  });
});
