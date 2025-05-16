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

test('Resume download link works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#resume-download')
  ]);

  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toContain('Nathan_Sheyman_Resume');
});
