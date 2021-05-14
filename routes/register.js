const express = require('express');
const companySchema = require('../models/companySchema');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    const company = await companySchema.findOne({ email : req.body.email });
    if (company) {
        res.json({ message: "==> email existant"});
    }
    else{
        try{
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            const addCompany = await companySchema.create(req.body);
            res.json(addCompany);
        }
        catch (error){
            console.log(error);
            res.status(500).json({ message: "internal server error"});
        }
    }
})

module.exports = router;