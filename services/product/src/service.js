const { NotFoundError, ValidationError } = require('@mini/shared');
const { listProducts, getProductById } = require('./repository');

async function fetchProducts(query = {}) {
  if (query.limit !== undefined && isNaN(Number(query.limit))) {
    throw new ValidationError('limit must be numeric');
  }
  if (query.offset !== undefined && isNaN(Number(query.offset))) {
    throw new ValidationError('offset must be numeric');
  }
  return listProducts({ limit: query.limit, offset: query.offset });
}

async function fetchProduct(id) {
  const product = await getProductById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
}

module.exports = {
  fetchProducts,
  fetchProduct,
};
