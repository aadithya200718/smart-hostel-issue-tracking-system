'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class IssueLog extends Model {
        static associate(models) {
            IssueLog.belongsTo(models.Issue, {
                foreignKey: 'issueId',
                as: 'issue'
            });
            IssueLog.belongsTo(models.User, {
                foreignKey: 'changedById',
                as: 'changedBy'
            });
        }
    }
    IssueLog.init({
        statusFrom: {
            type: DataTypes.STRING,
            allowNull: true
        },
        statusTo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true // Optional comment when changing status
        }
    }, {
        sequelize,
        modelName: 'IssueLog',
    });
    return IssueLog;
};
