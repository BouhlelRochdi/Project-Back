const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tagSchema = new schema({
    name: String,
    description: String
},
{
    timestamps: true,
    versionKey: false
});


const tagModel = mongoose.model('tags', tagSchema);
module.exports = tagModel;