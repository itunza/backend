'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    video_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    video_link: {
      allowNull: true,
      type: DataTypes.STRING
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'video',
    operatorsAliases: false
  });
  Video.associate = function (models) {
    Video.belongsTo(models.Category, {
      foreignKey: "category_id",
      onDelete: "CASCADE",
      as: "video_category"
    });
  };
  return Video;
};