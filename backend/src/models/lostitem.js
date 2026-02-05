'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LostItem extends Model {
        static associate(models) {
            LostItem.belongsTo(models.User, {
                foreignKey: 'reporterId',
                as: 'reporter'
            });
        }
    }
    LostItem.init({
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('LOST', 'FOUND'),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING, // Path to uploaded image
            allowNull: true
        },
        contactInfo: {
            type: DataTypes.STRING, // e.g., Phone number or Room number
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('OPEN', 'CLAIMED'),
            defaultValue: 'OPEN'
        }
    }, {
        sequelize,
        modelName: 'LostItem',
    });
    return LostItem;
};
