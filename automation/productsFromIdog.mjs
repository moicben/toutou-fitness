import puppeteer from 'puppeteer';
import fs from 'fs';
import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

(async () => {
    // Function to generate product details table
    async function generateCaracters(title, description, details) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4-turbo',
                messages: [
                    { role: 'system', content: 'Vous êtes un expert en rédaction pour le commerce électronique. Votre tâche est de créer des descriptions de produits détaillées et attrayantes.' },
                    { role: 'user', content: `
                        Veuillez générer un tableau HTML des caractéristiques pour le produit suivant :
                        \n\nTitre : ${title}\n\nDescription : ${description}\n\Détails : ${details}\n\n
                        Le tableau doit être bien structuré et mettre en avant les principales caractéristiques et avantages du produit.\n\n
                        Réponds uniquement avec la table HTML, sans balises <html>, <head> ou <body>.\n\n
                        Intègre aucune indication supplémentaire, seulement le tableau HTML.\n\n
                        Voici le tableau que tu as généré :
                    ` }
                ],
                max_tokens: 2000
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating product details:', error);
            throw error;
        }
    }

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

    const page = await browser.newPage();
    await page.goto('https://i-dog.eu/categorie-produit/harnais');

    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('li.product');
        const productList = [];
        productElements.forEach(product => {
            const productTitle = product.querySelector('h2').innerText;
            const productPrice = product.querySelector('.woocommerce-Price-amount').innerText;
            const productSource = product.querySelector('a').href;
            const slug = productSource.split('/').pop();
            productList.push({ productTitle, productPrice, productSource, slug });
        });
        return productList;
    });

    console.log('Products:', products);
    // const productsToExtract = products.slice(0, 1);
    const productsToExtract = products;
    console.log('Products to Extract:', productsToExtract);

    for (let i = 0; i < productsToExtract.length; i++) {
        const product = productsToExtract[i];
        await page.goto(product.productSource, { waitUntil: 'networkidle0' });
        const details = await page.evaluate(() => {
            const productDescription = document.querySelector('.woocommerce-product-details__short-description')?.innerText || '';
            const productImages = Array.from(document.querySelectorAll('figure.image-item img')).map(img => img.src);
            
            let productSizeImg = ''
            try {
                document.querySelector('button.woostify-size-guide-button').click();
                new Promise(resolve => setTimeout(resolve, 3000));
                productSizeImg = document.querySelector('.woostify-size-guide-table.active img').src;
            } catch (error) {
                console.error('Error fetching size guide image:', error);
            }

            const detailsElement = document.querySelector('div#tab-description > div');
            const details = detailsElement ? detailsElement.innerHTML.split('</section>').slice(0, -2).join('</section>') : '';
            const cleanDetails = details.replace(/(<[^>]+) style=".*?"/g, '$1').replace(/ class=".*?"/g, '');
            const productHighlight1 = cleanDetails;

            return { productDescription, productSizeImg, productImages, productHighlight1 };
        });

        const productCaracters = await generateCaracters(product.productTitle, details.productDescription, details.productHighlight1);

        productsToExtract[i] = { 
            ...product, 
            ...details, 
            productCaracters, 
            productDelivery: "Fast", 
            productStock: "En stock", 
            productCategoryName: "Harnais sportifs", 
            productCategorySlug: "harnais-sportifs", 
            productOptions: ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"], 
            productInfo: "8 tailles disponibles" 
        };
        console.log(`Progress: ${i + 1}/${productsToExtract.length}`);
    }

    console.log(productsToExtract);

    // Save the extracted products to products.json
    fs.writeFileSync('c:\\Users\\bendo\\Desktop\\Documents\\E-commerce\\Toutou Fitness\\automation\\products-test.json', JSON.stringify({ products: productsToExtract }, null, 2));

    await browser.close();
})();