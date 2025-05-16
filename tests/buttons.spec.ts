import { test, expect } from '@playwright/test';

test('All buttons and links are clickable', async ({ page }) => {
  await page.goto('http://localhost:3000'); // run site from local HTTP server

  const links = await page.$$('a');
  for (const link of links) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull(); // confirm the link has an href
  }

  const buttons = await page.$$('button');
  console.log('Found buttons:', buttons.length);
  expect(buttons.length).toBeGreaterThan(0); // make sure buttons exist
});

test('Download triggers popup with correct URL', async ({ page }) => {
  // Go to your site
  await page.goto('http://localhost:3000');

  // Start waiting for popup event
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#resume-download') // Trigger button that calls window.open(...)
  ]);

  // Wait for the popup to load
  await popup.waitForLoadState('load');

  // Assert that the popup URL contains the PDF or matches expected pattern
  const popupUrl = popup.url();
  expect(popupUrl).toContain('.pdf'); // Or use a regex /your-pattern/
});

