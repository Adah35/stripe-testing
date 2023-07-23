const SubscriptionPlan = require('../models/subscriptionPlan');

// Get all subscription plans
const getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get subscription plans' });
    }
};

// Get a subscription plan by ID
const getSubscriptionPlanById = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ error: 'Subscription plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get subscription plan' });
    }
};

// Create a new subscription plan
const createSubscriptionPlan = async (req, res) => {
    try {
        const newPlan = await SubscriptionPlan.create(req.body);
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subscription plan' });
    }
};

// Update a subscription plan
const updateSubscriptionPlan = async (req, res) => {
    try {
        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ error: 'Subscription plan not found' });
        }

        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subscription plan' });
    }
};

// Delete a subscription plan
const deleteSubscriptionPlan = async (req, res) => {
    try {
        const deletedPlan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

        if (!deletedPlan) {
            return res.status(404).json({ error: 'Subscription plan not found' });
        }

        res.json({ message: 'Subscription plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subscription plan' });
    }
};

module.exports = {
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
