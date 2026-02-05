const { Announcement, LostItem, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// --- Announcements ---
exports.createAnnouncement = catchAsync(async (req, res, next) => {
    const { title, content, priority } = req.body;

    const announcement = await Announcement.create({
        title,
        content,
        priority,
        authorId: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: { announcement }
    });
});

exports.getAnnouncements = catchAsync(async (req, res, next) => {
    const announcements = await Announcement.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'author', attributes: ['name', 'role'] }]
    });

    res.status(200).json({
        status: 'success',
        data: { announcements }
    });
});

// --- Lost & Found ---
exports.reportLostItem = catchAsync(async (req, res, next) => {
    const { itemName, description, category, location, contactInfo } = req.body;

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path.replace(/\\/g, '/');
    }

    const item = await LostItem.create({
        itemName,
        description,
        category,
        location,
        contactInfo,
        image: imagePath,
        reporterId: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: { item }
    });
});

exports.getLostItems = catchAsync(async (req, res, next) => {
    const { category, status } = req.query;
    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const items = await LostItem.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'reporter', attributes: ['name'] }]
    });

    res.status(200).json({
        status: 'success',
        data: { items }
    });
});

exports.markItemClaimed = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const item = await LostItem.findByPk(id);

    if (!item) {
        return next(new AppError('Item not found', 404));
    }

    // Only reporter or admin should be able to mark as claimed?
    // For simplicity, allowed for auth users or restrict to reporter/admin.
    if (req.user.role !== 'admin' && req.user.id !== item.reporterId) {
        return next(new AppError('You do not have permission to update this item', 403));
    }

    item.status = 'CLAIMED';
    await item.save();

    res.status(200).json({
        status: 'success',
        data: { item }
    });
});
