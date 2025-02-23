import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Doit être false car on utilise Xvfb
    executablePath: '/usr/bin/chromium-browser', // Vérifie avec 'which chromium-browser'
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ],
    env: {
      DISPLAY: ":99" // Ajoute Xvfb à Puppeteer
    }
  });

  const page = await browser.newPage();
  await page.goto('https://www.eneba.com/eneba-eneba-gift-card-5-eur-global', { waitUntil: 'networkidle2' });

  await page.screenshot({ path: 'eneba_test_screenshot.png' });

  console.log("✅ Puppeteer a bien fonctionné !");
  await browser.close();
})();
