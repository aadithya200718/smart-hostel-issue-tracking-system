'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Announcement extends Model {
        static associate(models) {
            Announcement.belongsTo(models.User, {
                foreignKey: 'authorId',
                as: 'author'
            });
        }
    }
    Announcement.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'HIGH'),
            defaultValue: 'LOW'
        }
    }, {
        sequelize,
        modelName: 'Announcement',
    });
    return Announcement;
};
