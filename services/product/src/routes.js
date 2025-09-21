const express = require('express');
const { fetchProducts, fetchProduct, createProductRecord, updateProductRecord } = require('./service');
const authRequired = require('./auth-middleware');
const adminOnly = require('./admin-middleware');

const router = express.Router();

router.get('/products', async (req, res, next) => {
  try {
    const items = await fetchProducts(req.query);
    res.json({ products: items });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const item = await fetchProduct(req.params.id);
    res.json({ product: item });
  } catch (error) {
    next(error);
  }
});

router.post('/products', authRequired, adminOnly, async (req, res, next) => {
  try {
    const product = await createProductRecord(req.body || {});
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

router.patch('/products/:id', authRequired, adminOnly, async (req, res, next) => {
  try {
    const product = await updateProductRecord(req.params.id, req.body || {});
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
