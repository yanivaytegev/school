const mongoose = require('mongoose');

const studentScheme = mongoose.Schema({
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
        min: 9,
        max: 9,
        required: true,
        unique: true
    },
    address: {
        type: String,
        min: 2,
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
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
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



module.exports = student = mongoose.model('student', studentScheme)
