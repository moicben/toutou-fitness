import puppeteer from 'puppeteer';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const apiKey = '0eed0614-bba7-47c2-9555-6dec45a1a886'
  const browserWSEndpoint = 'wss://brd-customer-hl_07d8ef96-zone-main-country-fr-city-dijon:vwmm40so32x4@brd.superproxy.io:9222'

  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1440,
      height: 920
    }
  });

  const page = await browser.newPage();
  await page.goto('https://whatismyipaddress.com/', { waitUntil: 'networkidle2' });

  delay(3000);

  await page.screenshot({ path: 'eneba_test_screenshot.png' });

  console.log("✅ Puppeteer a bien fonctionné !");
  await browser.close();
})();
