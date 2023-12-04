'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    message_title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    message_content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    created_by: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    modified_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: Date.now
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'message',
    operatorsAliases: false
  });
  Message.associate = function (models) {
    // associations can be defined here
  };
  return Message;
};