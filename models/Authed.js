const mongoose = require('mongoose');

const AuthedSchema = new mongoose.Schema({
    userId: {
        type: String,
        uqique: true,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Authed', AuthedSchema);
