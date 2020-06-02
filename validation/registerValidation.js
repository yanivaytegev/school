const validator = require('validator');

module.exports = registerValidation = (data) => {
    let error = {};

    if (validator.isEmpty(data.id)) {
        error.id = "enter id"
    }
    else if (!validator.isLength(data.id, { min: 9, max: 9 })) {
        error.id = "id must contain 9 digits/letters"
    }
    if (validator.isEmpty(data.firstName)) {
        error.firstName = "enter first name"
    }
    else if (!validator.isLength(data.firstName, { min: 2, max: 25 })) {
        error.firstName = "firstName must contain at list 2 digits"
    }
    if (validator.isEmpty(data.lastName)) {
        error.lastName = "enter last name"
    }
    else if (!validator.isLength(data.lastName, { min: 2, max: 25 })) {
        error.lastName = "lastName must contain at list 2 digits"
    }
    if (validator.isEmpty(data.address)) {
        error.address = "enter adress"
    }
    else if (!validator.isLength(data.address, { min: 2 })) {
        error.address = "adress must contain at list 2 digits"
    }
    if (validator.isEmpty(data.password)) {
        error.password = "enter password"
    }
    else if (!validator.isLength(data.password, { min: 8, max: 25 })) {
        error.password = "password must contain at list 8 digits/letters"
    }
    if (validator.isEmpty(data.mail)) {
        error.mail = "enter mail"
    }
    else if (!validator.isEmail(data.mail)) {
        error.mail = "eneter correct mail"
    }
    if (validator.isEmpty(data.birthDate)) {
        error.birthDate = "enter birth date please"
    }
    if (validator.isEmpty(data.phone)) {
        error.phone = "enter phone number"
    }
    else if (!validator.isLength(data.phone, { min: 9, max: 11 })) {
        error.phone = "enter correct number"
    }
    if (validator.isEmpty(data.photo)) {
        error.phone = "enter photo"
    }
    if (validator.isEmpty(data.gender)) {
        error.gender = "enter gender"
    }

    if ("teacherID" in data) {
        if (validator.isEmpty(data.teacherID)) {
            error.teacherID = "enter teacher"
        }
    }

    if ("class" in data) {
        if (validator.isEmpty(data.class)) {
            error.teacherID = "enter which class you teaching"
        }
    }

    return error;
}


