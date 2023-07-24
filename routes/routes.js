const express = require('express');
const router = express.Router();

// Import the controllers for users, subscription plans, subscriptions, and upgrade/downgrade history
const user = require('../controllers/user');
const subscriptionPlan = require('../controllers/subscriptionPlan');
const subscription = require('../controllers/subscription');
// const upgradeDowngradeHistoryController = require('./controllers/upgradeDowngradeHistoryController');

// Users Routes
router.get('/api/users', user.getUsers);
// router.get('/api/users/:id', user.getUserById);
router.post('/api/users', user.createUser);
// router.put('/api/users/:id', user.updateUser);
// router.delete('/api/users/:id', user.deleteUser);



// Subscriptions Routes
router.get('/api/subscriptions', subscription.getAllSubscriptions);
router.get('/api/subscriptions/:id', subscription.getSubscriptionById);
router.post('/api/subscriptions', subscription.createSubscription);
router.put('/api/subscriptions/:id', subscription.updateSubscription);
router.delete('/api/subscriptions/:id', subscription.deleteSubscription);

module.exports = router;
