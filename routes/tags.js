const express = require('express');
const tagSchema = require('../models/tagSchema');
const router = express.Router();


router.get('/tags', async (req, res) => {
    const tags = await tagSchema.find();
    res.json(tags);
});


//Find One By ID
router.get('/tags/:id', async (req, res) => {
    // const tags = await tagSchema.findOne({ id: req.params.id}); the same result with other way
    const tags = await tagSchema.findById(req.params.id);
    res.json(tags);
})


router.post('/tags', async (req, res) => {
    const tags = await tagSchema.create(req.body);
    res.json(tags);
});


router.put('/tags/:id', async (req, res) => {
    const tags = await tagSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tags);
});


router.delete('/tags/:id', async (req, res) => {
    const tags = await tagSchema.findByIdAndDelete(req.params.id);
    res.json({ message: `The tags ${tags.name} deleted successfully!` });
});


module.exports = router;