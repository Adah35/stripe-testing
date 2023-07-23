const mongoose = require('mongoose');

const upgradeDowngradeHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    from_plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    to_plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    date_of_change: { type: Date, required: true, default: Date.now },
    prorated_amount: { type: Number, default: 0 },
    // Add any other history details you need
}, { timestamps: true });

const UpgradeDowngradeHistory = mongoose.model('UpgradeDowngradeHistory', upgradeDowngradeHistorySchema);

module.exports = UpgradeDowngradeHistory;
