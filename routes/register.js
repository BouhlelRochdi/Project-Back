const express = require('express');
const companySchema = require('../models/companySchema');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');

const myStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destFile = path.resolve('./uploads');
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


router.post('/register', uploads.single('photo'), async (req, res) => {
    const company = await companySchema.findOne({ email : req.body.email });
    if (company) {
        res.status(400).json({ message: "==> email existant"});
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
            res.json({ message: 'Registred successfuly'});
        }
        catch (error){
            console.log(error);
            res.status(500).json({ message: "internal server error"});
        }
    }
})

module.exports = router;