const express = require('express');
const { findOneAndUpdate } = require('../models/eventSchema');
const eventSchema = require('../models/eventSchema');
const router = express.Router();


router.get('/events', async (req, res) => {
    const events = await eventSchema.find();
    res.status(200).json(events);
});


//Find One By ID
router.get('/events/:id', async (req, res) => {
    // const events = await eventSchema.findOne({ id: req.params.id}); the same result with other way
    const events = await eventSchema.findById(req.params.id);
    res.json(events);
})


router.post('/events', async (req, res) => {
    const events = await eventSchema.create(req.body);
    res.json(events);
});


router.post('/events', async (req, res) => {
    const events = await eventSchema.findOneAndUpdate(req.body);
    res.json(events);
});


router.put('/events/:id', async (req, res) => {
    const events = await eventSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(events);
});


router.delete('/events/:id', async (req, res) => {
    const events = await eventSchema.findByIdAndDelete(req.params.id);
    res.json({ message: `The events ${events.name} deleted successfully!` });
});


module.exports = router;