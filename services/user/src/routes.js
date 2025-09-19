const express = require('express');
const authRequired = require('./auth-middleware');
const { registerUser, loginUser, getProfile } = require('./service');

const router = express.Router();

router.post('/users/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/users/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/me', authRequired, async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: { code: 'not_found', message: 'User not found' } });
    }
    res.json({ user: profile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
