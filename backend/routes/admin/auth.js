// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/authController');
const auth = require('../../middleware/admin/auth');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.me);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
