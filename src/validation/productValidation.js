const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProductInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Product name is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};