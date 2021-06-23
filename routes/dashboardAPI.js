const express = require('express');
const eventSchema = require('../models/eventSchema');
const companySchema = require('../models/companySchema');
const tagsSchema = require('../models/tagSchema');
const userSchema = require('../models/userSchema');
const passport = require('passport');
const router = express.Router();

router.get('/dashboard',passport.authenticate('bearer', {session:false}), async (req, res) => {
    const events = await eventSchema.countDocuments();
    const companys = await companySchema.countDocuments();
    const tags = await tagsSchema.countDocuments();
    const users = await userSchema.countDocuments();
    res.json({events , companys , tags , users});
})
module.exports = router;