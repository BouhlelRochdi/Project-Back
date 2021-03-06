const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const eventSchema = new schema({
    name: String,
    description: String,
    startDate: Date,
    startTime: String,
    endDate: Date,
    endTime: String,
    photo: String,
    price: String,
    availableTicketNumber: Number,
    eventType: String,
    location: String,
    company: { type: Schema.Types.ObjectId, ref: 'company' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'tags' }]
},
{
    timestamps: true,
    versionKey: false
});


const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;