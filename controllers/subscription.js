const Subscription = require('../models/subscription')

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('user').populate('plan');
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get subscriptions' });
    }
};

// Get a subscription by ID
const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('user').populate('plan');
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get subscription' });
    }
};

// Create a new subscription
const createSubscription = async (req, res) => {
    const { user, plan, start_date, next_billing_date, status } = req.body

    try {
        const newSubscription = await Subscription.create(user, plan, start_date, next_billing_date, status);
        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subscription' });
    }
};

// Update a subscription
const updateSubscription = async (req, res) => {
    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user').populate('plan');

        if (!updatedSubscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subscription' });
    }
};

// Delete a subscription
const deleteSubscription = async (req, res) => {
    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id).populate('user').populate('plan');

        if (!deletedSubscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
};

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
};
