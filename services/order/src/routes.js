const express = require('express');
const authRequired = require('./auth-middleware');
const { listUserOrders, recordOrder } = require('./service');

const router = express.Router();

router.get('/orders', authRequired, async (req, res, next) => {
  try {
    const orders = await listUserOrders(req.user.id, req.query);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', authRequired, async (req, res, next) => {
  try {
    const order = await recordOrder({
      userId: req.user.id,
      productId: req.body?.productId,
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
