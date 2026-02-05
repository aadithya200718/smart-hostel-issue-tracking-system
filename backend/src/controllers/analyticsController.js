const { Issue, User, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getStats = catchAsync(async (req, res, next) => {
    // 1. Total Counts
    const totalIssues = await Issue.count();
    const openIssues = await Issue.count({ where: { status: 'OPEN' } });
    const resolvedIssues = await Issue.count({ where: { status: 'RESOLVED' } });

    // 2. By Priority
    const issuesByPriority = await Issue.findAll({
        attributes: ['priority', [sequelize.fn('COUNT', 'id'), 'count']],
        group: ['priority']
    });

    // 3. By Category
    const issuesByCategory = await Issue.findAll({
        attributes: ['category', [sequelize.fn('COUNT', 'id'), 'count']],
        group: ['category']
    });

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                totalIssues,
                openIssues,
                resolvedIssues,
                byPriority: issuesByPriority,
                byCategory: issuesByCategory
            }
        }
    });
});
