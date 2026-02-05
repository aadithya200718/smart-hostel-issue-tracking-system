'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Issue extends Model {
        static associate(models) {
            // User who reported the issue
            Issue.belongsTo(models.User, {
                foreignKey: 'reporterId',
                as: 'reporter'
            });

            // User assigned to fix the issue (e.g. maintenance staff)
            Issue.belongsTo(models.User, {
                foreignKey: 'assigneeId',
                as: 'assignee'
            });

            // History logs
            Issue.hasMany(models.IssueLog, {
                foreignKey: 'issueId',
                as: 'logs'
            });
        }
    }
    Issue.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'),
            defaultValue: 'OPEN'
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
            defaultValue: 'LOW'
        },
        category: {
            type: DataTypes.ENUM('ELECTRICAL', 'PLUMBING', 'FURNITURE', 'CIVIL', 'INTERNET', 'OTHER'),
            defaultValue: 'OTHER'
        },
        location: {
            type: DataTypes.STRING, // e.g., "Room 304", "2nd Floor Corridor"
            allowNull: false
        },
        images: {
            type: DataTypes.JSON, // Stores array of image paths
            defaultValue: []
        }
    }, {
        sequelize,
        modelName: 'Issue',
    });
    return Issue;
};
