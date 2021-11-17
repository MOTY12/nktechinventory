const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    surname: {
        type: String
    },
    firstname: {
        type: String
    },
    Email: {
        type: String
    },
    passwordHash: {
        type: String
    },
    token: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: 'false',
    }
})


module.exports = mongoose.model('User', userSchema)