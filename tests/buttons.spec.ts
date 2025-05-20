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

test('All buttons lead to valid links or actions', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const buttons = await page.$$('button');
  expect(buttons.length).toBeGreaterThan(0); // Ensure buttons exist

  for (const button of buttons) {
    const onclick = await button.getAttribute('onclick');
    const href = await button.getAttribute('href');

    // Check if the button has a valid action
    expect(onclick || href).not.toBeNull();

    if (href) {
      // If the button has an href, ensure it navigates correctly
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        button.click(),
      ]);
      await newPage.waitForLoadState('load');
      console.log(`Button navigated to: ${newPage.url()}`);
      await newPage.close();
    }
  }
});

test('Download My Resume button downloads a PDF file', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const downloadPromise = page.waitForEvent('download');
  await page.click('#resume-download');

  const download = await downloadPromise;

  // Ensure the downloaded file is a PDF
  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename.endsWith('.pdf')).toBe(true);

  const saveDir = path.join(__dirname, 'downloads');
  fs.mkdirSync(saveDir, { recursive: true });

  const savePath = path.join(saveDir, suggestedFilename);
  await download.saveAs(savePath);

  expect(fs.existsSync(savePath)).toBe(true);
});

test('All interactive elements lead to valid destinations', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Debugging: Capture a screenshot of the page
  await page.screenshot({ path: 'debug-screenshot.png' });

  // Debugging: Log the page content
  console.log(await page.content());

  const buttons = await page.$$('button');
  expect(buttons.length).toBeGreaterThan(0); // Ensure buttons exist

  for (const button of buttons) {
    const href = await button.getAttribute('href');
    expect(href).not.toBeNull(); // Ensure the button has an href

    if (href?.startsWith('http')) {
      // If the button opens in a new tab, validate the URL
      const popupPromise = page.context().waitForEvent('page');
      await button.click();
      const newPage = await popupPromise;
      await newPage.waitForLoadState('load');
      console.log(`Opened external link: ${newPage.url()}`);
      await newPage.close();
    }
  }
});



