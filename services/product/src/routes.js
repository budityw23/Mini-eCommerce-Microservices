const express = require('express');
const { fetchProducts, fetchProduct } = require('./service');

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

module.exports = router;
