import puppeteer from 'puppeteer';
import crypto from 'crypto';


async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*---------------------------------*/

const cardHolder = 'Benedikt Strokin'
let cardNumber = '5355852092479488'
const cardExpiration = '02/30'
const cardCVC = '379'

/*---------------------------------*/

const ownerName = cardHolder.split(' ')[0];
const ownerSurname = cardHolder.split(' ')[1]; 
const cardEmail = `${ownerName}.${ownerSurname}@tenvil.com`;

cardNumber = cardNumber.replace(/ /g, '');
let cardMonth = parseInt(cardExpiration.split('/')[0]);
cardMonth = cardMonth.toString();
let cardYear = parseInt(cardExpiration.split('/')[1]);
cardYear = cardYear.toString();


/*---------------------------------*/

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // Mettre false pour voir le rendu si tu as un accès GUI
    executablePath: '/snap/bin/chromium', // Spécifier le chemin du navigateur installé avec snap
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1440,920',
      '--disable-dev-shm-usage',
    ], // Optimisations pour réduire le temps de chargement
    defaultViewport: {
      width: 1280,
      height: 920,
    }
    });

  const page = await browser.newPage();
  
  // Aller sur la page des cartes cadeaux Eneba
  await page.goto('https://www.eneba.com/eneba-eneba-gift-card-5-eur-global', { waitUntil: 'networkidle2' });
  console.log('Page loaded');
  
  await delay(5000);
  
  // Cliquer sur buy now
  const buyNowSelector = '#app > main > div > div > div.O8Oi6F > div > div.nt5C9V > div > div.YHd7Sm.AX1zeG > div > div > div.CzH2Oq > div.jM_rb8 > div.mJtqU0 > button';
  await page.waitForSelector(buyNowSelector);
  await page.click(buyNowSelector);
  console.log('Buy now clicked');

  await delay(8000);

  // Cliquer sur checkout
  const checkoutSelector = '#app > main > form > div.y7qjBq > div:nth-child(2) > button'
  await page.waitForSelector(checkoutSelector);
  await page.click(checkoutSelector);
  console.log('Checkout clicked');

  await delay(7000);

  // Choisir le mode de paiement
  const paymentSelector = 'li.VP_hF7.I0quPj button'
  await page.waitForSelector(paymentSelector);
  await page.click(paymentSelector);
  
  await delay(7000);

  // Entrer les informations de la carte
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

  // Cliquer sur le bouton de paiement
  const payButtonSelector = '#app > main > form > div > div.OBhmV_ > div.JQa1oY > button.pr0yIU';
  await page.waitForSelector(payButtonSelector);
  await page.click(payButtonSelector);
  console.log('Payment clicked');
  await delay(5000);

  // Enter Email Address 
  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.press('Tab');
  await delay(500);
  await page.keyboard.type(cardEmail)
  console.log('Email entered');
  await delay(1000);

  // Submit the form
  await page.keyboard.press('Enter');
  await delay(15000);

  // Prend une capture d'écran de la page
  await page.screenshot({ path: 'eneba_screenshot.png' });

  // Convert email to md5
  // const md5Hash = crypto.createHash('md5').update(email).digest('hex');
  // console.log("MD5 : " + md5Hash);

  // // Get emails
  // const url = 'https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/' + md5Hash + '/';
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'x-rapidapi-key': '05a4e12364mshcf22fc9ff60af0fp1428ccjsn9014ff4739d8',
  //     'x-rapidapi-host': 'privatix-temp-mail-v1.p.rapidapi.com'
  //   }
  // };

  // // Fetching emails
  // const response = await fetch(url, options);
  // const result = await response.text();
  // console.log("RESULT : " + result);

  // // Extract the OTP code
  // const otpCodes = result.match(/([0-9]{4}) : votre code/g);
  // const otpCode = otpCodes[otpCodes.length - 1].match(/([0-9]{4})/)[0];
  // console.log("OTP : " + otpCode);
 
  
  await browser.close();
})();