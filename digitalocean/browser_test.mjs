import puppeteer from 'puppeteer';

(async () => {
  const browserWSEndpoint = 'wss://brd-customer-hl_07d8ef96-zone-main-country-fr:vwmm40so32x4@brd.superproxy.io:9222';

  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1440,
      height: 600
    }
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  let distance = 5;
  let success = false;

  while (!success) {
    try {
      await client.send('Proxy.setLocation', {
        lat: 46.032399,
        lon: 0.548805,  // Coordonnées de la ville de Poitiers
        distance: distance, // Distance en kilomètres
        strict: true
      });

      await page.authenticate({
        username,
        password
      });

      await page.goto('https://mylocation.org/');
      await page.screenshot({ path: 'mylocation.png' });

      success = true;
    } catch (error) {
      while (!error.originalMessage) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Attendre 100ms
      }
      if (error.originalMessage.includes('no_peer')) {
        console.log(`No peer found within ${distance} km, increasing distance...`);
        distance += 5;
      } else {
        console.error('An unexpected error occurred:', error);
        break;
      }
    }
  }

  await browser.close();
})();