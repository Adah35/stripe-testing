const UpgradeDowngradeHistory = require('../models/upgradeDowngradeHistory');

// Get all upgrade/downgrade history
const getAllHistory = async (req, res) => {
    try {
        const history = await UpgradeDowngradeHistory.find().populate('user').populate('from_plan').populate('to_plan');
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get upgrade/downgrade history' });
    }
};

// Get upgrade/downgrade history by ID
const getHistoryById = async (req, res) => {
    try {
        const history = await UpgradeDowngradeHistory.findById(req.params.id).populate('user').populate('from_plan').populate('to_plan');
        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get history' });
    }
};

// Add more upgrade/downgrade history controllers as needed (e
