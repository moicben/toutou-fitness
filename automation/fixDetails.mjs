import fs from 'fs';

// Load the products JSON file
const productsFilePath = '../products.json';
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Function to fix product descriptions
function fixProductDescriptions(products) {
  products.forEach(product => {
    if (product.productDescription && !product.productDescription.includes('<ul>')) {
      const items = product.productDescription.split('\n').map(item => `<li>${item.trim()}</li>`).join('\n');
      product.productDescription = `<ul>\n${items}\n</ul>`;
    }
  });
}

// Fix the product descriptions
fixProductDescriptions(productsData.products);

// Save the updated products JSON file
fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2), 'utf8');

console.log('Product descriptions have been fixed.');