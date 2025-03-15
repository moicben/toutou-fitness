import fs from 'fs';

// Load the products JSON file
const productsFilePath = '../products.json';
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Function to remove duplicate <div> tags
function removeDuplicateDivTags(content) {
  return content.replace(/<\/div>\s*<\/div>/g, '</div>');
}

// Function to remove duplicate images
function removeDuplicateImages(images) {
  return [...new Set(images)];
}

// Iterate over each product and clean the productHighlight1 field and productImages field
productsData.products.forEach(product => {
  if (product.productHighlight1) {
    product.productHighlight1 = removeDuplicateDivTags(product.productHighlight1);
  }
  if (product.productImages) {
    product.productImages = removeDuplicateImages(product.productImages);
  }
});

// Save the updated products JSON file
fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2), 'utf8');
console.log('Duplicate <div> tags and images have been removed.');