const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    plan_name: { type: String, required: true },
    plan_description: { type: String, required: true },
    plan_price: { type: Number, required: true },
    plan_billing_interval: { type: String, enum: ['monthly', 'annually'], required: true },
    plan_features: { type: [String], required: true },
    // Add any other plan details you need
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
