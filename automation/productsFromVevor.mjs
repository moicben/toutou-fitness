import puppeteer from 'puppeteer';
import fs from 'fs';

const urls = [
  'https://www.vevor.fr/roues-d-exercice-pour-petits-animaux-c_12313/vevor-tapis-de-marche-de-course-electrique-pour-chiens-de-taille-moyenne-90-kg-p_010175835771',
  'https://www.vevor.fr/roues-d-exercice-pour-petits-animaux-c_12313/vevor-tapis-de-marche-de-course-electrique-pour-chiens-entrainement-agilite-p_010268467354',
  'https://www.vevor.fr/roues-d-exercice-pour-petits-animaux-c_12313/vevor-tapis-de-marche-de-course-pour-chiens-capacite-de-charge-100-kg-interieur-p_010658887862'
];

async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      ],
      ignoreDefaultArgs: ['--disable-extensions']
    });

    const productList = [];

    for (const url of urls) {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      const productSource = url;

      const productTitle = await page.$eval('h1', el => el.textContent.trim());

      // Click 6 times on the next button
      for (let i = 0; i < 12; i++) {
        await page.click('#js-wrapDetailBasic > div.detailImg > div.detailImg_main > span.detailImg_next.js-btnNextMainImg.icon-arrowright_line.slick-arrow');
        await page.waitForTimeout(500); // Wait for half a second between clicks
      }

      const productImages = await page.$$eval('#js-boxMainImg > div > div > div > div > span > img', imgs => imgs.map(img => img.src));

      const productDescription = await page.$eval('#js-wrapDetailBasic > div.detailInfo > div.detailGuide.vcr-show.js-toggleWrap > ul', el => {
        el.querySelectorAll('*').forEach(node => node.removeAttribute('class'));
        return el.innerHTML;
      });

      const productDetail = await page.$eval('#js-HASH_DESC > div', el => {
        el.querySelectorAll('*').forEach(node => node.removeAttribute('class'));
        return el.innerHTML;
      });

      productList.push({
        productSource,
        productTitle,
        productImages,
        productDescription,
        productDetail
      });

      await page.close();
    }

    await browser.close();

    fs.writeFileSync('products.json', JSON.stringify({ products: productList }, null, 2));
    console.log('Products saved to products.json');
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

main();