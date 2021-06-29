const express = require('express');
const eventSchema = require('../models/eventSchema');
const companySchema = require('../models/companySchema');
const router = express.Router();
const passport = require('passport');
const multer = require('multer')
const path = require('path');

// start upload image API
const myStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destFile = path.resolve('./uploads/Events');
        callback(null, destFile);
    }, 
    filename: (req, file, callback) => {
        const name = Date.now() + path.extname(file.originalname);
        callback(null, name);
    }
});

function fileFilterFn (req, file, cb) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    const extFile = path.extname(file.originalname);
    const allowdExtension = [".jpg", "jpeg", "png"];
    cb(null, allowdExtension.includes(extFile))
  }

const uploads = multer({ storage : myStorage, fileFilter : fileFilterFn}); 
//end upload images


router.get('/events',passport.authenticate('bearer', {session : false}), async (req, res) => {
    if (req.user.role == "superAdmin"){
        // if user is superAdmin he have all Events
        const events = await eventSchema.find();
        res.status(200).json(events);
    }else {
        // else show the user(which is only admin) only his events
        const events = await eventSchema.find({company: req.user._id});
        res.status(200).json(events);
    }
});


//Find One By ID
router.get('/events/:id',passport.authenticate('bearer', {session : false}), async (req, res) => {
    // const events = await eventSchema.findOne({ id: req.params.id}); the same result with other way
    const events = await eventSchema.findById(req.params.id);
    res.json(events);
})


router.post('/events', [passport.authenticate('bearer', {session : false}), uploads.single('photo')], async (req, res) => {
    try{
        if( req.file !== undefined){
            req.body.photo = req.file.filename;
        }
        // affect current companyId to this event
        req.body.company = req.user._id;
        const event = await eventSchema.create(req.body);
        //affect event to connected company (current Company)
        await companySchema.findByIdAndUpdate(req.user._id, {$push:{events : event._id}}, {new: true});
        res.json(event);
    }catch(error){
        res.status(400).json({ message : error});
    }
});


router.put('/events/:id',[passport.authenticate('bearer', {session : false}), uploads.single('photo')], async (req, res) => {
    if( req.file !== undefined){
        req.body.photo = req.file.filename;
    }
    const events = await eventSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(events);
});


router.delete('/events/:id', async (req, res) => {
    //delete this event
    const events = await eventSchema.findByIdAndDelete(req.params.id);
    // we need to deleted also from the company ()
    const deleteFromCompany = await companySchema.updateMany({},{$pull:{events: req.params.id}},{new:true, multi: true})
    res.status(200).json({ message: `The events ${events.name} deleted successfully!` });
});


module.exports = router;