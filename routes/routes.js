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

// Subscription Plans Routes
router.get('/api/plans', subscriptionPlan.getAllSubscriptionPlans);
router.get('/api/plans/:id', subscriptionPlan.getSubscriptionPlanById);
router.post('/api/plans', subscriptionPlan.createSubscriptionPlan);
router.put('/api/plans/:id', subscriptionPlan.updateSubscriptionPlan);
router.delete('/api/plans/:id', subscriptionPlan.deleteSubscriptionPlan);

// Subscriptions Routes
router.get('/api/subscriptions', subscription.getAllSubscriptions);
router.get('/api/subscriptions/:id', subscription.getSubscriptionById);
router.post('/api/subscriptions', subscription.createSubscription);
router.put('/api/subscriptions/:id', subscription.updateSubscription);
router.delete('/api/subscriptions/:id', subscription.deleteSubscription);

// Upgrade/Downgrade History Routes
// router.get('/api/history', upgradeDowngradeHistoryController.getAllHistory);
// router.get('/api/history/:id', upgradeDowngradeHistoryController.getHistoryById);
// You can add other routes for history (e.g., create, delete) if needed

module.exports = router;
