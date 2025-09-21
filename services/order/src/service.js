const { randomUUID } = require('node:crypto');
const { ValidationError } = require('@mini/shared');
const { listOrdersByUser, createOrder } = require('./repository');

async function listUserOrders(userId, query = {}) {
  if (!userId) {
    throw new ValidationError('user id required');
  }
  if (query.limit !== undefined && isNaN(Number(query.limit))) {
    throw new ValidationError('limit must be numeric');
  }
  if (query.offset !== undefined && isNaN(Number(query.offset))) {
    throw new ValidationError('offset must be numeric');
  }

  return listOrdersByUser(userId, { limit: query.limit, offset: query.offset });
}

async function recordOrder({ userId, productId }) {
  if (!userId || !productId) {
    throw new ValidationError('userId and productId are required');
  }

  return createOrder({ id: randomUUID(), userId, productId });
}

module.exports = {
  listUserOrders,
  recordOrder,
};
