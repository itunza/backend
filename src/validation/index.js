const cleanPhone = require("./cleanPhone");
const createError = require("./create-error");
const createMessage = require("./create-message");
const validatePersonnelInput = require("./personnelValidation");
const validateCategoryInput = require("./categoryValidation");
const validateProductInput = require("./productValidation");
const validateVideoInput = require("./videoValidation");
const validateMessageInput = require("./messageValidation");
const validateEmployeeInput = require("./employeeValidation");
const validateLoginInput = require("./loginValidation");
const isEmpty = require("./is-empty");
const validateId = require("./objectId");

module.exports = {
  cleanPhone,
  createError,
  createMessage,
  validateEmployeeInput,
  validateMessageInput,
  validateVideoInput,
  validateProductInput,
  validateCategoryInput,
  validatePersonnelInput,
  validateLoginInput,
  isEmpty,
  validateId
};