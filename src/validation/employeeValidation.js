const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEmployeeInput(data) {
    let errors = {};
    data.fname = !isEmpty(data.fname) ? data.fname : "";
    data.lname = !isEmpty(data.lname) ? data.lname : "";

    if (validator.isEmpty(data.fname)) {
        errors.fname = "Employee first name is required";
    }
    if (validator.isEmpty(data.lname)) {
        errors.lname = "Employee last name is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};