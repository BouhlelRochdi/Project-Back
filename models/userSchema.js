const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    fName: String,
    lName: String,
    email: String
},
{
    timestamps: true,
    versionKey: false
});


const userModel = mongoose.model('user', userSchema);
module.exports = userModel;