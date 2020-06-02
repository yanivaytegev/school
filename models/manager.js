const mongoose = require('mongoose');

const managerScheme = mongoose.Schema({
    firstName: {
        type: String,
        min: 2,
        max: 25,
        required: true
    },
    lastName: {
        type: String,
        min: 2,
        max: 25,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        min: 2,
        max: 25,
        required: true
    },
    password: {
        type: String,
        min: 5,
        max: 25,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        require: true
    },
    birthDate: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    register_date: {
        type: Date,
        default: Date.now()
    },
    photo: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    }
});



module.exports = manager = mongoose.model('manager', managerScheme)
