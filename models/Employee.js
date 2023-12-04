'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    employee_fname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    employee_lname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    employee_brid: {
      allowNull: true,
      type: DataTypes.STRING
    },
    employee_ab_number: {
      allowNull: true,
      type: DataTypes.STRING
    },
    employee_otp: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    otp_request_date: {
      allowNull: true,
      type: DataTypes.DATE
    },
    verification_date: {
      allowNull: true,
      type: DataTypes.DATE
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
    tableName: 'employee',
    operatorsAliases: false
  });
  Employee.associate = function (models) {
    // associations can be defined here
  };
  return Employee;
};