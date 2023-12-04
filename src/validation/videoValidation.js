const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateVideoInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.link = !isEmpty(data.link) ? data.link : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Video name is required";
    }
    if (validator.isEmpty(data.link)) {
        errors.link = "Video link is required";
    }
    if (data.category > 0) {} else {
        errors.category = "Video category is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};