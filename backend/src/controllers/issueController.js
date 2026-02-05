const { Issue, IssueLog, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

exports.createIssue = catchAsync(async (req, res, next) => {
    const { title, description, category, location, priority } = req.body;

    let imagePaths = [];
    if (req.files) {
        imagePaths = req.files.map(file => file.path.replace(/\\/g, '/')); // Normalize paths
    }

    const newIssue = await Issue.create({
        title,
        description,
        category,
        location,
        priority,
        reporterId: req.user.id,
        images: imagePaths,
        status: 'OPEN'
    });

    // Create initial log
    await IssueLog.create({
        issueId: newIssue.id,
        statusFrom: null,
        statusTo: 'OPEN',
        changedById: req.user.id,
        remark: 'Issue reported'
    });

    res.status(201).json({
        status: 'success',
        data: {
            issue: newIssue
        }
    });
});

exports.getAllIssues = catchAsync(async (req, res, next) => {
    const { status, priority, myIssues, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // If student, only show their issues unless specified otherwise
    if (req.user.role === 'student') {
        where.reporterId = req.user.id;
    } else if (myIssues === 'true') {
        // For staff/admin checking their OWN reported issues
        where.reporterId = req.user.id;
    }

    // Filter by assignee (e.g., for "My Assigned Tasks")
    if (req.query.assignedToMe === 'true') {
        where.assigneeId = req.user.id;
    }

    const issues = await Issue.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: 'reporter', attributes: ['name', 'email'] },
            { model: User, as: 'assignee', attributes: ['name', 'email'] }
        ]
    });

    res.status(200).json({
        status: 'success',
        results: issues.count,
        data: {
            issues: issues.rows
        }
    });
});

exports.getIssue = catchAsync(async (req, res, next) => {
    const issue = await Issue.findByPk(req.params.id, {
        include: [
            { model: User, as: 'reporter', attributes: ['name', 'email'] },
            { model: User, as: 'assignee', attributes: ['name', 'email'] },
            {
                model: IssueLog,
                as: 'logs',
                include: [{ model: User, as: 'changedBy', attributes: ['name'] }]
            }
        ],
        order: [[{ model: IssueLog, as: 'logs' }, 'createdAt', 'DESC']] // Show logs newest first
    });

    if (!issue) {
        return next(new AppError('No issue found with that ID', 404));
    }

    // Access control
    if (req.user.role === 'student' && issue.reporterId !== req.user.id) {
        return next(new AppError('You do not have permission to view this issue', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            issue
        }
    });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    const { status, remark } = req.body;
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
        return next(new AppError('No issue found with that ID', 404));
    }

    const oldStatus = issue.status;

    // Update issue
    issue.status = status;
    if (status === 'IN_PROGRESS' && !issue.assigneeId) {
        issue.assigneeId = req.user.id; // Auto-assign to staff who starts it
    }
    await issue.save();

    // Create Log
    await IssueLog.create({
        issueId: issue.id,
        statusFrom: oldStatus,
        statusTo: status,
        changedById: req.user.id,
        remark: remark || `Status updated to ${status}`
    });

    res.status(200).json({
        status: 'success',
        data: {
            issue
        }
    });
});

exports.assignIssue = catchAsync(async (req, res, next) => {
    const { assigneeId } = req.body;
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
        return next(new AppError('No issue found with that ID', 404));
    }

    const assignee = await User.findByPk(assigneeId);
    if (!assignee) {
        return next(new AppError('Assignee user not found', 404));
    }

    // Update issue
    issue.assigneeId = assigneeId;
    if (issue.status === 'OPEN') {
        issue.status = 'IN_PROGRESS'; // Auto-move to In Progress if assigned
    }
    await issue.save();

    // Create Log
    await IssueLog.create({
        issueId: issue.id,
        statusFrom: issue.status,
        statusTo: issue.status,
        changedById: req.user.id,
        remark: `Assigned to ${assignee.name}`
    });

    res.status(200).json({
        status: 'success',
        data: {
            issue
        }
    });
});

exports.markDuplicate = catchAsync(async (req, res, next) => {
    const { originalIssueId } = req.body;
    const duplicateIssue = await Issue.findByPk(req.params.id);

    if (!duplicateIssue) {
        return next(new AppError('Issue not found', 404));
    }

    const oldStatus = duplicateIssue.status;
    duplicateIssue.status = 'REJECTED';
    await duplicateIssue.save();

    await IssueLog.create({
        issueId: duplicateIssue.id,
        statusFrom: oldStatus,
        statusTo: 'REJECTED',
        changedById: req.user.id,
        remark: `Marked as duplicate of Issue #${originalIssueId}`
    });

    res.status(200).json({
        status: 'success',
        data: {
            issue: duplicateIssue
        }
    });
});
