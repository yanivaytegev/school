const validator = require('validator');

module.exports = registerValidation = (data, file) => {

    let error = {};

    if (validator.isEmpty(data.title)) {
        error.title = "enter title"
    }
    else if (!validator.isLength(data.title, { min: 2 })) {
        error.title = "title must contain 2 letters"
    }
    if (validator.isEmpty(data.description)) {
        error.description = "enter description"
    }
    else if (!validator.isLength(data.description, { min: 2 })) {
        error.description = "description contain at list 2 letters"
    }
    if (!data.file) {
        error.photo = "enter photo"
    }
    return error;
}


