const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

exports.getAllStaff = catchAsync(async (req, res, next) => {
    const staff = await User.findAll({
        where: {
            role: {
                [Op.or]: ['warden', 'maintenance', 'admin']
            }
        },
        attributes: ['id', 'name', 'email', 'role']
    });

    res.status(200).json({
        status: 'success',
        data: {
            users: staff
        }
    });
});
