const puppeteer = require('puppeteer');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------------------ PROXY SETTINGS ----------------------------

const proxyUrl = 'http://fr.smartproxy.com:40001';
const username = 'bstrokin123';
const password = 'E~9jBoNk8pnW5w1ahu';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cardHolder, cardNumber, cardExpiration, cardCVC, payAmount } = req.body;

  const giftCardValues = [5, 10, 15, 20, 25, 30, 50, 70, 100];
  const ownerName = cardHolder.split(' ')[0];
  const ownerSurname = cardHolder.split(' ')[1];
  const cardEmail = `${ownerName}.${ownerSurname}@tenvil.com`;

  const formattedCardNumber = cardNumber.replace(/ /g, '');
  const cardMonth = parseInt(cardExpiration.split('/')[0]).toString();
  const cardYear = parseInt(cardExpiration.split('/')[1]).toString();

  try {
    const browserWSEndpoint = 'wss://brd-customer-hl_07d8ef96-zone-main-country-fr-city-dijon:vwmm40so32x4@brd.superproxy.io:9222';

    const browser = await puppeteer.connect({
      browserWSEndpoint,
      defaultViewport: {
        width: 1440,
        height: 920
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

    await page.screenshot({path: 'eneba_cart.png'});

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
    await page.keyboard.type(formattedCardNumber);
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
    await delay(150000);

    await browser.close();

    res.status(200).json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
}