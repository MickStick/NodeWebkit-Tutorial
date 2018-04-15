const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    uname: { type: String, require: true },
    email: { type: String, required: true },
    avi: { type: String, required: true },
    bio: { type: String, required: false },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;