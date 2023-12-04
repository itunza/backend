'use strict';
module.exports = (sequelize, DataTypes) => {
  const PersonnelType = sequelize.define('PersonnelType', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    personnel_type_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_by: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    modified_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Date.now
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'personnel_type',
    operatorsAliases: false
  });
  PersonnelType.associate = function (models) {
    // associations can be defined here
    PersonnelType.hasMany(models.Personnel, {
      foreignKey: 'id',
      as: 'personnel'
    })
  };
  return PersonnelType;
};