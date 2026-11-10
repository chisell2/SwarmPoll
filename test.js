// test.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log("Starting automated test...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Load the HTML file locally
  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath);

  console.log("Page loaded. Clicking the simulation button...");
  
  // Click the main button
  await page.click('button');
  
  // Wait a brief moment for the UI to update
  await page.waitForTimeout(500);

  // Check if the result screen is now visible
  const resultScreen = await page.locator('#result-screen');
  const isVisible = await resultScreen.isVisible();
  
  if (!isVisible) {
    console.error("❌ TEST FAILED: The result screen did not appear.");
    process.exit(1); // This tells GitHub the test failed
  }

  // Check if the raw text actually contains a percentage
  const rawText = await page.locator('#raw-text').innerText();
  if (!rawText.includes('%')) {
    console.error("❌ TEST FAILED: The results did not calculate a percentage.");
    process.exit(1);
  }

  console.log(`✅ TEST PASSED: The tool works. Result shown: ${rawText}`);
  await browser.close();
})();