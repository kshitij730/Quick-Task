const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');

// Memory cache for notifications
const notificationCache = new Map();

const startScheduler = () => {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('Running task notification scheduler...');
        try {
            const users = await User.find({});
            const now = new Date();
            const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            for (const user of users) {
                const userId = user._id.toString();

                const upcomingTasks = await Task.find({
                    user: user._id,
                    status: { $ne: 'completed' },
                    dueDate: { $gte: now, $lte: in24Hours }
                });

                const overdueTasks = await Task.find({
                    user: user._id,
                    status: { $ne: 'completed' },
                    dueDate: { $lt: now }
                });

                notificationCache.set(userId, {
                    upcomingTasks,
                    overdueTasks,
                    lastUpdated: new Date()
                });
            }
        } catch (error) {
            console.error('Scheduler Error:', error.message);
        }
    });
};

const getNotificationsForUser = async (userId) => {
    // If not in cache, calculate immediately once
    if (!notificationCache.has(userId.toString())) {
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const upcomingTasks = await Task.find({
            user: userId,
            status: { $ne: 'completed' },
            dueDate: { $gte: now, $lte: in24Hours }
        });

        const overdueTasks = await Task.find({
            user: userId,
            status: { $ne: 'completed' },
            dueDate: { $lt: now }
        });

        notificationCache.set(userId.toString(), {
            upcomingTasks,
            overdueTasks,
            lastUpdated: new Date()
        });
    }
    return notificationCache.get(userId.toString());
};

module.exports = { startScheduler, getNotificationsForUser };
