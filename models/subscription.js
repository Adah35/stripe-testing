const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    planId: { type: String, required: true },
    start_date: { type: Date, required: true, default: Date.now },
    next_billing_date: { type: Date, required: true },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], required: true, default: 'active' },
    // Add any other subscription details you need
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
