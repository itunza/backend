'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    product_parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    product_sku: {
      allowNull: true,
      type: DataTypes.STRING
    },
    product_images: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      allowNull: true,
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
    tableName: 'product',
    operatorsAliases: false
  });
  Product.associate = function (models) {
    Product.belongsTo(models.Category, {
      foreignKey: "category_id",
      onDelete: "CASCADE",
      as: "product_category"
    });
    Product.belongsTo(models.Product, {
      foreignKey: "product_parent",
      as: "parent_product"
    });
  };
  return Product;
};