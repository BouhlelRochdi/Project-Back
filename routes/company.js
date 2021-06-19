const express = require('express');
const companySchema = require('../models/companySchema');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const myStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destFile = path.resolve('./uploads/Companys');
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

//   
const uploads = multer({ storage : myStorage, fileFilter : fileFilterFn, limits: { fieldSize: 8 * 1024 * 1024 }
}); 


// Get All Company
router.get('/company', passport.authenticate('bearer', {session : false}), async (req, res) => {
    if(req.user.role == 'superAdmin')
    {
        const company = await companySchema.find();
        res.status(200).json(company);
    }
    else{
        res.status(200).json([req.user]);
    }
});


//get with Populate
router.get('/fullCompany', passport.authenticate('bearer', {session : false}), async (req, res) => {
    const eventCompany = await companySchema.populate('events'); //afficher avec les event associer
    res.json(eventCompany);
});


//Find One By ID
router.get('/company/:id', passport.authenticate('bearer', {session : false}), async (req, res) => {
    // const company = await companySchema.findOne({ id: req.params.id}); the same result with other way
    const company = await companySchema.findById(req.params.id);
    res.status(200).json(company);
})

// Create simple Company without verification
router.post('/company', [passport.authenticate('bearer', {session : false}), uploads.single('photo') ], async (req, res) => {
    if( req.file !== undefined){
        req.body.photo = req.file.filename;
    }
    const company = await companySchema.create(req.body);
    res.status(200).json(company);
});

//Create company with email check and password crypt
router.post('/createCompany',[passport.authenticate('bearer', {session : false}), uploads.single('photo')] ,async (req, res) => {
    const company = await companySchema.findOne({ email : req.body.email });
    if (company) {
        res.status(400).json({ message: "Email already exist"});
    }
    else{
        try{
            if( req.file !== undefined){
                req.body.photo = req.file.filename;
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            const addCompany = await companySchema.create(req.body);
            res.json({ message: 'Created successfuly'});
        }
        catch (error){
            console.log(error);
            res.status(500).json({ message: "internal server error"});
        }
    }
})


// Find by id and Update
router.put('/company/:id', [passport.authenticate('bearer', {session : false}), uploads.single('photo')], async (req, res) => {
    if( req.file !== undefined){
        req.body.photo = req.file.filename;
    }
    const company = await companySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(company);
});


// Delete Company
router.delete('/company/:id', passport.authenticate('bearer', {session : false}), async (req, res) => {
    const company = await companySchema.findByIdAndDelete(req.params.id);
    res.json({ message: `The company ${company.name} deleted successfully!` });
});


// Find out role and determinate display



module.exports = router;