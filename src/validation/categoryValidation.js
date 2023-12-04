const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCategoryInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Category name is required";
    }
    if (data.type > 0) {} else {
        errors.type = "Category type is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};