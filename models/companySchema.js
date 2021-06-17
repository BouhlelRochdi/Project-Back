const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const companySchema = new schema({
    name: String,
    description : String,
    email: String,
    password: String,
    role: {type : String, default : 'admin'},
    photo: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }]
},
{
    timestamps: true,
    versionKey: false
});


const companyModel = mongoose.model('company', companySchema);
module.exports = companyModel;