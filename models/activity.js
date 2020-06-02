const mongoose = require('mongoose');

const activityScheme = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    photo: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now()
    }
});



module.exports = activity = mongoose.model('activity', activityScheme)
