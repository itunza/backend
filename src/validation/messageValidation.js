const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateMessageInput(data) {
    let errors = {};
    data.title = !isEmpty(data.title) ? data.title : "";
    data.content = !isEmpty(data.content) ? data.content : "";

    if (validator.isEmpty(data.title)) {
        errors.title = "Message title is required";
    }
    if (validator.isEmpty(data.content)) {
        errors.content = "Message content is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};