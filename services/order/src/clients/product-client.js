const config = require('../config');
const { ValidationError } = require('@mini/shared');

async function fetchProduct(productId) {
  const base = config.PRODUCT_SERVICE_URL.endsWith('/')
    ? config.PRODUCT_SERVICE_URL.slice(0, -1)
    : config.PRODUCT_SERVICE_URL;
  const res = await fetch(`${base}/products/${productId}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new ValidationError('product lookup failed');
  }

  const body = await res.json();
  return body.product;
}

module.exports = {
  fetchProduct,
};
