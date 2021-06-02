const { static } = require('express');
const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const companySchema = require('../models/companySchema');
const jwt = require('jsonwebtoken');



let transport = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zlatanbouhlel@gmail.com',
        pass: 'Rochedev20323557@'
    }
});


router.get('/reset-password/:id/:token', async (req, res) => {
//send mail
try {
    const company = await companySchema.find();
    console.log(company);
    res.json({ message : 'done'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post('/forgot-password', async (req, res) => {

    try {
        const email = req.body.email;
        const company = await companySchema.findOne({ email: email });
        if (!company) {
            res.status(401).json({ message: 'email does not registred .. go to register and sign up' });
        } else {
            // create reset token ( delete if the user have an old token)
            const tokenData = {
                id: company._id,
                email: company.email
            }
            const token = jwt.sign(tokenData, 'keyReset', { expiresIn: '20m' });

            // send email with the new token
            const message = {
                from: 'azerty@example.com', // sender address
                to: "rochdi.bouhlel@hotmail.fr,zlatanbouhlel@gmail.com", // list of receivers
                subject: "Reset password", // Subject line
                text: "Votre nouveau password est ", // plain text body
                html:
                    `pleas continue with this link to reset your password ==> http://localhost:3000/api/reset-password/${tokenData.id}/${token}` // html body
            };
            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    res.json({ message: 'mail has been sent', info });
                }
            });
            res.json({ message: 'email sent with link reset' });
        }
        // email reçu avec un lien vers front reset password 
        // recuperer le lien et continuer 
    } catch (error) {
        res.status(500).json({ message: 'internal server error!', error });
    }
})


module.exports = router;