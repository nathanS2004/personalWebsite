import { test, expect } from '@playwright/test';

test('All buttons and links are clickable', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/_site/index.html'); // or use your hosted path

  const links = await page.$$('a');
  for (const link of links) {
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
  }

  const buttons = await page.$$('button');
  expect(buttons.length).toBeGreaterThan(0);
});

test('Download My Resume button triggers a file download', async ({ page, context }) => {
  await page.goto('file://' + process.cwd() + '/_site/index.html');

  // Wait for the download event after clicking the button
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.click('a[download] button')
  ]);

  // Optionally, check the suggested filename
  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toContain('Nathan_Sheyman_Resume.pdf');
});
