import fs from 'fs';

// Load the products JSON file
const productsFilePath = '../products.json';
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Function to extract image URLs from HTML content
function extractImageUrls(htmlContent) {
  const regex = /<img[^>]+src="([^">]+)"/g;
  let matches;
  const urls = [];
  while ((matches = regex.exec(htmlContent)) !== null) {
    urls.push(matches[1]);
  }
  return urls;
}

// Function to update product images
function updateProductImages(products) {
  products.forEach(product => {
    const imageSources = new Set(product.productImages || []);

    // Extract images from various fields
    ['productAdvantages', 'productHighlight1', 'productHighlight2', 'productHighlight3', 'productHighlight4'].forEach(field => {
      if (product[field]) {
        extractImageUrls(product[field]).forEach(url => imageSources.add(url));
      }
    });

    // Convert Set back to array and remove the last image if it's a duplicate
    product.productImages = Array.from(imageSources);
  });
}

// Function to add productCategoryName based on productCategorySlug
function addProductCategoryName(products) {
  products.forEach(product => {
    switch (product.productCategorySlug) {
      case 'velos-appartement':
        product.productCategoryName = "Vélos d'appartement";
        break;
      case 'rameurs-interieur':
        product.productCategoryName = "Rameurs d'intérieur";
        break;
      case 'tapis-de-course':
        product.productCategoryName = "Tapis de course";
        break;
      default:
        product.productCategoryName = "Autre";
    }
  });
}

// Update the product images
updateProductImages(productsData.products);

// Add productCategoryName to each product
addProductCategoryName(productsData.products);

// Save the updated products JSON file
fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2), 'utf8');

console.log('Product images and category names have been updated.');