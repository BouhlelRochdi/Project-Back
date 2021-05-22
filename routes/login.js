const express = require('express');
const router = express.Router();
const companySchema = require('../models/companySchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
    try {
        const company = await companySchema.findOne({ email: req.body.email })
        if (company === null) {
            res.status(400).json({ message: 'Non enregistrer .. email nexiste pas!' })
        }
        else {
            const check = await bcrypt.compare(req.body.password, company.password); // comparer les deux pwd bcrypt.compare(pwd nn crypter de la requete, pwd crypter enregistrer)
            if (check) {
                const tokenData = {
                    id : company._id,
                    email : company.email
                } // ces les infos qu'on veut transferer avec le jwt
                const jeton = jwt.sign(tokenData, 'key'); // creation du jeton avec tokenData et une clé privée
                res.json({ message: 'Welcome .. successfully connected', token: jeton });
            }
            else {
                res.json({ message: 'Please verify your Password' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error!', error });
    }
})



module.exports = router;