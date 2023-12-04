'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    category_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    category_image: {
      allowNull: true,
      type: DataTypes.STRING
    },
    category_parent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category_type: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'category',
    operatorsAliases: false
  });
  Category.associate = function (models) {
    Category.hasMany(models.Product, {
      foreignKey: "category_id",
      as: "product_category"
    });
    Category.hasMany(models.Video, {
      foreignKey: "category_id",
      as: "video_category"
    });
    Category.belongsTo(models.Category, {
      foreignKey: "category_parent",
      as: "parent_category"
    });
  };
  return Category;
};