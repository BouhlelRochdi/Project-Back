const express = require('express');
const eventSchema = require('../models/eventSchema');
const userSchema = require('../models/userSchema');
const qrCode = require('qrcode');
const pdf = require("pdf-creator-node");
const nodeMailer = require('nodemailer');
const fs = require("fs");
const ejs = require("ejs");
const path = require('path');
const router = express.Router();

let transport = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zlatanbouhlel@gmail.com',
        pass: 'Rochedev20323557@'
    }
});

router.post('/reservation/:id', async (req, res) => {
    const events = await eventSchema.findById(req.params.id);
    if (events.availableTicketNumber <= 0 && req.body.reservations.length + 1 <= events.availableTicketNumber) {
        res.status(400).json({ message: 'all tickets are solded' });
    } else {
        try {
            // 1. ceation des reservations
            const user = await userSchema.create(req.body.user);
            console.log(user);

            const data = {
                name: user.fName + user.lName,
                email: user.email,
                eventName: events.name,
                startDate: events.startDate,
                endDate: events.endDate,
                startTime: events.startTime,
                endTime: events.endTime,
                avaialbleTickets: events.availableTicketNumber,
                location: events.location
            }
            // 2. pour chaue reservation 
            // create QR code 

            // const qrImg = qrCode.toFile(
            //     './uploads/QRCodes/QR' + Date.now() + '.png',
            //     [{ data: Buffer.from([253, 254, 255]), mode: 'byte' }], {
            //     type: 'png',
            //     width: 200,
            //     errorCorrectionLevel: 'H'
            // });

            // create PDF ticket 
            // const  messageParameters = {
            //     userName : user.fName, 
            //     link: `http://localhost:4200/#/`
            // };

            // const template = fs.readFileSync(path.resolve('./mailTemplates', 'reservation.html'),{encoding: 'utf-8'});
            // const html = ejs.render(template, messageParameters);

            // const data = {
            //     html: html,
            //     data: {
            //     //   users: users,
            //     },
            //     path: "./mailTemplates/Reservations",
            //     type: "",
            //   };
            // let options = {
            //     "height": "11.25in",
            //     "width": "8.5in",
            //     "header": {
            //         "height": "20mm"
            //     },
            //     "footer": {
            //         "height": "20mm",
            //     },
            // };

            // pdf.create(data, options).toFile("reservation.pdf", (err, res) => {
            //     if (err) {
            //         res.status(400).json({message : err});
            //     } else {

            //         const message = {
            //             from: 'FivePoints@gmail.com', // sender address
            //             to: 'rochdi.bouhlel@hotmail.fr', //user.email, // list of receivers
            //             subject: "Confirmation reservation", // Subject line
            //             // html: PDF // html body
            //         };
            //         transport.sendMail(message,  (err, info) => {
            //             if (err) {
            //                 console.log(err)
            //             } else {
            //                 res.status(200).json({ message: 'Mail has been sent', info });
            //             }
            //         });
            //     }
            // });
            // send email 
            
            // envoyer ticket via email 
            
            

            // diminuer le nombre de ticket
            
            // 3. response 
            res.status(200).json({ message: 'Ckeck your mail!' });
        } catch (err) {
            console.log(err)
        }
        // res.json(events);
    }
});


module.exports = router;