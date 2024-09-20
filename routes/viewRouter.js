const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

router.post('/submit-user-data', authController.protect,viewController.updateUserData);
router.get('/signup', viewController.getSignupForm);
router.get('/forgot-password', viewController.getForgotPasswordForm); 
router.get('/reset-password/:token', viewController.getResetPasswordForm); 

module.exports = router;
