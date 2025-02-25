import puppeteer from 'puppeteer-core';
import crypto from 'crypto';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------------------ PROXY SETTINGS ----------------------------

  const proxyUrl = 'http://fr.smartproxy.com:40001';
  const username = 'bstrokin123';
  const password = 'E~9jBoNk8pnW5w1ahu';

// ------------------------------ PAYMENT DATA ------------------------------

  const cardHolder = 'B R';
  let cardNumber = '4403 9332 8483 0723';
  const cardExpiration = '08/25';
  const cardCVC = '221';

  const payAmount = 10;

// ------------------------------ FORMATTING DATA ------------------------------

const giftCardValues = [5, 10, 15, 20, 25, 30, 50, 70, 100];
const ownerName = cardHolder.split(' ')[0];
const ownerSurname = cardHolder.split(' ')[1];
const cardEmail = `${ownerName}.${ownerSurname}@tenvil.com`;

cardNumber = cardNumber.replace(/ /g, '');
let cardMonth = parseInt(cardExpiration.split('/')[0]);
cardMonth = cardMonth.toString();
let cardYear = parseInt(cardExpiration.split('/')[1]);
cardYear = cardYear.toString();

// ------------------------------ LOGIC --------------------------------------

function getGiftCardCombination(amount, values) {
  let result = [];
  let remaining = amount * 0.94; // 6% below the payAmount

  for (let i = values.length - 1; i >= 0; i--) {
    while (remaining >= values[i]) {
      result.push(values[i]);
      remaining -= values[i];
    }
  }
  return result;
}

(async () => {
  const browserWSEndpoint = 'wss://brd-customer-hl_07d8ef96-zone-main-country-fr-city-dijon:vwmm40so32x4@brd.superproxy.io:9222'

  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      width: 1440,
      height: 920
    }
  });

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   defaultViewport: {
  //     width: 1440,
  //     height: 920
  //   },
  //   args: [
  //     // `--proxy-server=${proxyUrl}`,
  //     // `--proxy-auth=${username}:${password}`,
  //     '--no-sandbox',
  //     '--disable-setuid-sandbox',
  //     '--disable-dev-shm-usage',
  //     '--disable-accelerated-2d-canvas',
  //     '--no-first-run',
  //     '--no-zygote',
  //     '--viewport-size=1440x900'
  //   ]
  // });

  const page = await browser.newPage();

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

  // Clicking checkout button
  const checkoutSelector = '#app > main > form > div.y7qjBq > div:nth-child(2) > button';
  await page.waitForSelector(checkoutSelector);
  await page.click(checkoutSelector);
  console.log('Checkout clicked');

  await delay(7000);

  // Selecting card payment method
  const paymentSelector = 'li.VP_hF7.I0quPj button';
  await page.waitForSelector(paymentSelector);
  await page.click(paymentSelector);

  await delay(7000);

  // Entering card details
  await page.keyboard.press('Tab');
  await page.keyboard.type(cardNumber);
  await delay(500);

  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.type(cardHolder);
  await delay(500);

  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.type(cardMonth);
  await page.keyboard.type(cardYear);
  await delay(500);

  await page.keyboard.type(cardCVC);
  await delay(2000);
  console.log('Card details entered');
  await page.screenshot({ path: 'eneba_screenshot.png' });

  // Clicking pay button
  const payButtonSelector = '#app > main > form > div > div.OBhmV_ > div.JQa1oY > button.pr0yIU';
  await page.waitForSelector(payButtonSelector);
  await page.click(payButtonSelector);
  console.log('Payment clicked');
  await delay(5000);

  // Entering email
  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.type(cardEmail);
  console.log('Email entered');
  await delay(1000);

  await page.keyboard.press('Enter');

  // Loading 3D-sucure popup
  await delay(15000);
  console.log('3D-secure loaded');
  await page.screenshot({ path: 'eneba_3d.png' });

  // Giving time to user to valid 3D-secure
  await delay(40000);
  console.log('3D-secure time passed');
  await page.screenshot({ path: 'eneba_passed.png' });

  // Whait for payment to be processed
  await delay(10000);
  await page.screenshot({ path: 'eneba_processed.png' });

  // CAPTCHA handling: If you're expecting a CAPTCHA 
  const client = await page.createCDPSession();
  console.log('Waiting captcha to solve...');
  const { status } = await client.send('Captcha.waitForSolve', {
    detectTimeout: 10000,
  });
  console.log('Captcha solve status:', status);

  await delay(400000);
  

  await browser.close();
})();