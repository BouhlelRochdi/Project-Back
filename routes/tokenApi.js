const express = require('express');
const router = express.Router();
const tokenSchema = require('../models/tokenSchema');
const companySchema = require('../models/companySchema');


router.get('/token', async (req, res) => {
    console.log('get API');
    const token = await tokenSchema.find();
    res.json(token);
});


router.post('/token', async (req, res) => {
    console.log('Post API');
    const token = await tokenSchema.create(req.body);
    res.json(token);
});


module.exports = router;