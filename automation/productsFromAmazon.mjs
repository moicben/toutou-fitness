import puppeteer from 'puppeteer';
import fs from 'fs';

const urls = [
  'https://www.amazon.fr/lwjunmm-Roulant-Moyenne-Machine-Compagnie/dp/B0DG881YDZ/ref=sr_1_4?dib=eyJ2IjoiMSJ9.b4iq1J_fyfb0Nldddpy2NBRiNWSvjllDBitYSDgtl5fhfCJxoRyq-eBCntMPOY0QMExGPOhYmZQLWrbOd4FTPU7mp3hBmlBSvc04lBNi1sWk30CS4qM0WC4e6q7EC5QIsr6bbODpy08MSPiAAVXfWjvkdSRg-4GhtptdDVqLKeHGQ_0JYWOCc5hkyyY02XnWXvKZ_qkSsxuB1kqKLr01n-31XZrjuoCfGIsettJObW7p4-QfkkHSHp0LC-gJo3EdUE9xX01aCNH7TZHldKFmwo0sESAmV7S3YOFHWdK-Vu_NO9nAEcvK53ABJRd78SF3RoRCy7bee2WRmKgzJVgwgJ3UlX9584u829KHJP7M28A.RAHMDkJqfoY02vRYhTc8ZQUuLdZNcPxUqXM0GC6PNms&dib_tag=se&keywords=tapis+roulant&qid=1741521834&refinements=p_n_availability%3A437882031&s=pet-supplies&sr=1-4',
  'https://www.amazon.fr/roulant-compagnie-fournitures-danimaux-exercice/dp/B0DWY1HWTQ/ref=sr_1_17?dib=eyJ2IjoiMSJ9.b4iq1J_fyfb0Nldddpy2NBRiNWSvjllDBitYSDgtl5fhfCJxoRyq-eBCntMPOY0QMExGPOhYmZQLWrbOd4FTPU7mp3hBmlBSvc04lBNi1sWk30CS4qM0WC4e6q7EC5QIsr6bbODpy08MSPiAAVXfWjvkdSRg-4GhtptdDVqLKeHGQ_0JYWOCc5hkyyY02XnWXvKZ_qkSsxuB1kqKLr01n-31XZrjuoCfGIsettJObW7p4-QfkkHSHp0LC-gJo3EdUE9xX01aCNH7TZHldKFmwo0sESAmV7S3YOFHWdK-Vu_NO9nAEcvK53ABJRd78SF3RoRCy7bee2WRmKgzJVgwgJ3UlX9584u829KHJP7M28A.RAHMDkJqfoY02vRYhTc8ZQUuLdZNcPxUqXM0GC6PNms&dib_tag=se&keywords=tapis+roulant&qid=1741521834&refinements=p_n_availability%3A437882031&s=pet-supplies&sr=1-17',
  'https://www.amazon.fr/Lakenbroade-Roulant-%C3%A9quipement-dexercice-lint%C3%A9rieur/dp/B0DHV83GLR/ref=sr_1_26?dib=eyJ2IjoiMSJ9.YJGSuPHyvCfj8c-n9d_PHiZOt0AaBToKWnPilxiZOXfAgsmA4FNMozQf6um3DvOE_l7k4MuuCrChDmZSwdAVRsh77Bow0a6B2RGRvISKqI-JS3Lj9hWO76dLOtJtJEtXpYw3WYgMwK0WHExnqX8LYKhPaE4MgO6BdUoVLtFeQrZn6OWjHmodDh-KXGzjSZKNp8AQI4sq8FtuneXv8yCasq9BvFwg07DNB95cpY1jd-JAY9Xb956XZs4-8EaWfWOoFXWSsoPfLLIDhmMuCYfy4z5V6Vm1CFkMWq-qQuRn4nGkKTC3kdF-PW8Hs366wqRro1FN9yRMNrJaw92NNStbKJrkfjKTm-FTIXx0WtNicQw.3UtLUalYCzVHAy9PAgtcRArA_HS1vhFKrtAKFdaC2qs&dib_tag=se&keywords=tapis+roulant&qid=1741527924&refinements=p_n_availability%3A437882031&s=pet-supplies&sr=1-26&xpid=IbEl_B3ju_6yI'
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
      await page.goto(url);


      // délaie de 4 secondes
      await page.waitForTimeout(4000);

      const productSource = url;

      const productTitle = await page.$eval('h1 > span', el => el.textContent.trim());


      const productImages = await page.$$eval(`#main-image-container > ul > li.image.item > span > span > div > img`, imgs => imgs.map(img => img.src));

      const productDescription = await page.$eval('#feature-bullets > ul', el => {
        el.querySelectorAll('*').forEach(node => node.removeAttribute('class'));
        return el.innerHTML;
      });

      const productCaracters = await page.$eval('#productDescription', el => {
        el.querySelectorAll('*').forEach(node => node.removeAttribute('class'));
        return el.innerHTML;
      });

      productList.push({
        productSource,
        productTitle,
        productImages,
        productDescription,
        productCaracters
      });

      await page.close();
    }

    // Read existing products from products.json
    let existingProducts = [];
    if (fs.existsSync('products.json')) {
      const data = fs.readFileSync('products.json');
      existingProducts = JSON.parse(data).products;
    }

    // Combine existing products with new products
    const allProducts = existingProducts.concat(productList);

    // Save combined products to products.json
    fs.writeFileSync('products.json', JSON.stringify({ products: allProducts }, null, 2));
    console.log('Products saved to products.json');
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

main();