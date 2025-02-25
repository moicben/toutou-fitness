const { delay } = require('./utils');

async function completePayment(browser, page, cardHolder, formattedCardNumber, cardMonth, cardYear, cardCVC, cardEmail) {

  // Selecting card payment method
  const paymentSelector = 'li.VP_hF7.I0quPj button';
  await page.waitForSelector(paymentSelector);
  await page.click(paymentSelector);

  await delay(7500);

  // Entering card details
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
  await page.screenshot({ path: 'eneba_card.png' });

  // Get the total cart amount
  const payAmount = await page.evaluate(() => {
    const element = document.querySelector("#app > main > form > div > div.OBhmV_ > div.aRPwVh > div > span");
    console.log('Eneba Cart Amount:', element.innerText);
    return element ? parseFloat(element.innerText.replace('€', '')) : null;
  });

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
  await page.screenshot({ path: 'eneba_email.png' });

  await delay(1000);
  await page.keyboard.press('Enter');

  return { browser, page, payAmount };
}

module.exports = { completePayment };