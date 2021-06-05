const { static } = require('express');
const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const companySchema = require('../models/companySchema');
const tokenSchema = require('../models/tokenSchema');
const tokenApi = require('./tokenApi');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const bcrypt = require('bcrypt');



let transport = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zlatanbouhlel@gmail.com',
        pass: 'Rochedev20323557@'
    }
});


router.post('/reset-password', async (req, res) => {
    try {
        const tokenExsit = await tokenSchema.findOne({token: req.body.token}).populate('company');
        if (tokenExsit){
            // const company = await companySchema.findById(tokenExsit.companyId);

            // hash  the password 
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hashSync(req.body.password, salt);
            // update password
            const updatedCompany = await companySchema.findByIdAndUpdate(tokenExsit.companyId,{password: hash},{new : true});
            // delete this used token 
            await tokenSchema.findOneAndDelete({_id: tokenExsit._id});
            // return respnse
            res.status(200).json({message : 'successfuly updated'});
        }
        else{
            res.status(400).json({message : 'Token is expired or already used'});
        }
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
            res.status(400).json({ message: 'email does not registred .. go to register and sign up' });
        } 
        else {
                // create reset token ( delete if the user have an old token)
                const tokenschema = await tokenSchema.findOne({companyId : company._id});
                if (tokenschema){
                    await tokenSchema.findByIdAndDelete(tokenschema._id);
                    // tokenSchema.deleteOne(tokenschema);
                }
                const token = randomString.generate(32);
                // const token = jwt.sign(tokenData, 'keyReset', { expiresIn: '20m' });
                const newResetToken = await tokenSchema.create({companyId : company._id, token : token});
    
                // render with  parameters
                const  messageParameters = {
                    companyName : company.name, 
                    link: `http://localhost:4200/#/reset-password/${token}`
                };

                const template = fs.readFileSync(path.resolve('./mailTemplates', 'resetPwdMail.html'),{encoding: 'utf-8'});
                // console.log(template);
                const html = ejs.render(template, messageParameters);
                // console.log(html);
                // send email with the new token
                const message = {
                    from: 'zlatanbouhlel@gmail.com', // sender address
                    to: company.email, // list of receivers
                    subject: "Reset password", // Subject line
                    html: html // html body
                };
                transport.sendMail(message,  (err, info) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json({ message: 'Mail has been sent', info });
                    }
                });
                // res.json({ message: 'email sent with link reset' });
            }
            // email reçu avec un lien vers front reset password 
            // recuperer le lien et continuer 
        } catch (error) {
        res.status(500).json({ message: 'internal server error!', error });
    }
})


module.exports = router;