import puppeteer from 'puppeteer';
import crypto from 'crypto';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------------------ DYNAMIC DATA ------------------------------

const cardHolder = 'Benedikt Strokin';
let cardNumber = '5355852092479488';
const cardExpiration = '02/30';
const cardCVC = '379';

const payAmount = 269.99;


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
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/snap/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1440,920',
      '--disable-dev-shm-usage',
    ],
    defaultViewport: {
      width: 1440,
      height: 920,
    }
  });

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

  // Continue with the rest of your checkout process
  const checkoutSelector = '#app > main > form > div.y7qjBq > div:nth-child(2) > button';
  await page.waitForSelector(checkoutSelector);
  await page.click(checkoutSelector);
  console.log('Checkout clicked');

  await delay(7000);

  const paymentSelector = 'li.VP_hF7.I0quPj button';
  await page.waitForSelector(paymentSelector);
  await page.click(paymentSelector);

  await delay(7000);

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

  const payButtonSelector = '#app > main > form > div > div.OBhmV_ > div.JQa1oY > button.pr0yIU';
  await page.waitForSelector(payButtonSelector);
  await page.click(payButtonSelector);
  console.log('Payment clicked');
  await delay(5000);

  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.type(cardEmail);
  console.log('Email entered');
  await delay(1000);

  await page.keyboard.press('Enter');
  await delay(15000);

  await page.screenshot({ path: 'eneba_screenshot.png' });

  await browser.close();
})();