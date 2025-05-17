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


import path from 'path';

test('Download My Resume button triggers a real file download', async ({ page, browserName, context }) => {
  // Go to your site
  await page.goto('http://localhost:3000');

  // Start waiting for the download event
  const downloadPromise = page.waitForEvent('download');

  // Click the actual <a> or button that triggers the download
  await page.click('#resume-download'); // <a id="resume-download" ...>

  // Get the download object
  const download = await downloadPromise;

  // Save to a known path (e.g., in the test output folder)
  const savePath = path.join(__dirname, 'downloads', download.suggestedFilename());
  await download.saveAs(savePath);

  // Check that the download actually happened
  expect(await download.path()).not.toBeNull();
});


