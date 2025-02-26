const puppeteer = require('puppeteer-core');
const { delay, getGiftCardCombination } = require('./utils');

let browser, page, client;

async function startSession(userLat, userLong, payAmount, giftCardValues) {
  console.log(`Init checkout for ${payAmount} EUR...`);

  const browserWSEndpoint = 'wss://brd-customer-hl_07d8ef96-zone-main-country-fr:vwmm40so32x4@brd.superproxy.io:9222';

  browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1440,
      height: 920
    }
  });
  page = await browser.newPage();
  client = await page.target().createCDPSession();

  let distance = 5;
  let success = false;

  while (!success) {
    try {
      await client.send('Proxy.setLocation', {
        lat: userLat,
        lon: userLong,
        distance: distance, // Distance en kilomètres
        strict: true
      });

      success = true;
    } catch (error) {
      while (!error.originalMessage) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Attendre 100ms
      }
      if (error.originalMessage.includes('no_peer')) {
        console.log(`No peer found within ${distance} km, increasing distance...`);
        distance += 10;
      } else {
        console.error('An unexpected error occurred:', error);
        break;
      }
    }
  }

  const giftCardCombination = getGiftCardCombination(payAmount, giftCardValues);
  for (const value of giftCardCombination) {
    await page.goto(`https://www.eneba.com/eneba-eneba-gift-card-${value}-eur-global`, { waitUntil: 'networkidle2' });
    console.log(`Page loaded for ${value} EUR gift card`);

    await delay(3000);

    const buyNowSelector = '#app > main > div > div > div.O8Oi6F > div > div.nt5C9V > div > div.YHd7Sm.AX1zeG > div > div > div.CzH2Oq > div.jM_rb8 > div.mJtqU0 > button';
    await page.waitForSelector(buyNowSelector);
    await page.click(buyNowSelector);
    console.log('Buy now clicked');

    await delay(4000);
  }

  await delay(3000);
  await page.screenshot({path: 'eneba_cart.png'});

  // Clicking checkout
  const checkoutSelector = '#app > main > form > div.y7qjBq > div:nth-child(2) > button';
  await page.waitForSelector(checkoutSelector);
  await page.click(checkoutSelector);
  console.log('Checkout clicked');

  await delay(5000);
  await page.screenshot({path: 'eneba_checkout.png'});

  return { browser, page, client };
}

module.exports = { startSession };