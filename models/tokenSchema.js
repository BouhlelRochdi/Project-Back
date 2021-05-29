const { Schema } = require('mongoose');
const mongoose = require('mongoose');
// const companySchema = require('./companySchema');
const schema = mongoose.Schema;


const tokenSchema = new schema({
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "company",
      },
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: '1m',
      }
});


const tokenModel = mongoose.model('token', tokenSchema);
module.exports = tokenModel;