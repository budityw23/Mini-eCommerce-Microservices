const { NotFoundError, ValidationError } = require('@mini/shared');
const { randomUUID } = require('node:crypto');
const { listProducts, getProductById, createProduct, updateProduct } = require('./repository');

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

function parsePrice(price) {
  if (price === undefined) return undefined;
  const value = Number(price);
  if (Number.isNaN(value) || value < 0) {
    throw new ValidationError('price must be a non-negative number');
  }
  return Math.round(value * 100) / 100;
}

async function createProductRecord({ name, description, price }) {
  if (!name || !description) {
    throw new ValidationError('name and description are required');
  }
  const parsedPrice = parsePrice(price);
  if (parsedPrice === undefined) {
    throw new ValidationError('price is required');
  }
  const product = await createProduct({
    id: randomUUID(),
    name,
    description,
    price: parsedPrice,
  });
  return product;
}

async function updateProductRecord(id, payload) {
  if (!id) {
    throw new ValidationError('product id is required');
  }
  const updates = {};
  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.price !== undefined) updates.price = parsePrice(payload.price);

  const product = await updateProduct(id, updates);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
}

module.exports = {
  fetchProducts,
  fetchProduct,
  createProductRecord,
  updateProductRecord,
};
