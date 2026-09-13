const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { initiateKhaltiPayment, verifyKhaltiPayment } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/khalti/initiate', requireAuth, initiateKhaltiPayment);
router.post('/verify', requireAuth, verifyKhaltiPayment);

module.exports = router;