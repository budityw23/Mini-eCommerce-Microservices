const express = require('express');
const authRequired = require('./auth-middleware');
const { listUserOrders } = require('./service');

const router = express.Router();

router.get('/orders', authRequired, async (req, res, next) => {
  try {
    const orders = await listUserOrders(req.user.id, req.query);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
