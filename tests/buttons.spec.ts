import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('All <a> links are functional and buttons exist', async ({ page, context }) => {
  await page.goto('http://localhost:3000');

  const links = await page.$$('a');
  expect(links.length).toBeGreaterThan(0); // Confirm at least one link exists

  for (const link of links) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();

    // If link opens in a new tab, track it
    if (href?.startsWith('http')) {
      const popupPromise = context.waitForEvent('page');
      await link.click();
      const newPage = await popupPromise;
      await newPage.waitForLoadState('load');
      console.log(`Opened external link: ${newPage.url()}`);
      await expect(newPage).toHaveURL(href);
      await newPage.close();
    }
  }

  const buttons = await page.$$('button');
  console.log('Found buttons:', buttons.length);
  expect(buttons.length).toBeGreaterThan(0);
});

test('Download My Resume button triggers a real file download', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const downloadPromise = page.waitForEvent('download');
  await page.click('#resume-download');

  const download = await downloadPromise;

  const saveDir = path.join(__dirname, 'downloads');
  fs.mkdirSync(saveDir, { recursive: true });

  const savePath = path.join(saveDir, download.suggestedFilename());
  await download.saveAs(savePath);

  expect(fs.existsSync(savePath)).toBe(true);
});



