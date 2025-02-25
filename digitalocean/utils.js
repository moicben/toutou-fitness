async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getGiftCardCombination(amount, values) {
  let result = [];
  let remaining = amount * 0.80; // 15% promo code + 5% eneba-fees

  for (let i = values.length - 1; i >= 0; i--) {
    while (remaining >= values[i]) {
      result.push(values[i]);
      remaining -= values[i];
    }
  }
  return result;
}

module.exports = { delay, getGiftCardCombination };