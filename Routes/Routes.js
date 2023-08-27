const express = require('express');
const router = express.Router();
const controller = require('../Controllers/Controller');

router.post('/signUp', controller.register);
router.post('/signIn', controller.login);
router.post('/create-checkout-session', controller.sessionPaymnet);
router.put('/UpdateUser', controller.userUpdate);

module.exports = router;
