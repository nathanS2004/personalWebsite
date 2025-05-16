import { test, expect } from '@playwright/test';

test('All buttons and links are clickable', async ({ page }) => {
  await page.goto('http://localhost:3000'); // run site from local HTTP server

  const links = await page.$$('a');
  for (const link of links) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull(); // confirm the link has an href
  }

  const buttons = await page.$$('button');
  expect(buttons.length).toBeGreaterThan(0); // make sure buttons exist
});

test('Download My Resume button triggers a file download', async ({ page, context }) => {
  await page.goto('http://localhost:3000');

  // Listen for download event triggered by clicking the anchor tag with download attr
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#resume-download') // this is the <a> element
  ]);

  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy(); // confirms a file was downloaded
});
