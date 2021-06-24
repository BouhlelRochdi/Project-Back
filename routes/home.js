const express = require('express');
const router = express.Router();
const Event = require('../models/eventSchema');


// All Events with assosita company + tags
router.get('/all-events', async (req, res) => {
    const allEvents = await Event.find()
    .populate('tags').populate('company'); 
    res.json(allEvents);
});

// Event Details
router.get('/event-details/:id', async (req, res) => {
    const eventDetail = await Event.findById(req.params.id)
    .populate('tags').populate('company');
    res.json(eventDetail);
});


module.exports = router;