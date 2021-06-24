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

            const qrCodeData = {
                name: user.fName + user.lName,
                email: user.email,
                eventName: events.name,
                startDate: events.startDate,
                endDate: events.endDate,
                startTime: events.startTime,
                endTime: events.endTime,
                location: events.location
            };

            // 2. pour chaue reservation 
            // 2.1 create QR code 

            await qrCode.toFile('./uploads/QRCodes/' + user._id + '.png',
                JSON.stringify(qrCodeData), {
                type: 'png',
                width: 200,
                errorCorrectionLevel: 'H'
            });

            // create PDF ticket **********************************
            // convert
            const eventStartDate = `${new Date(events.startDate).getDate()}/${new Date(events.startDate).getMonth()}/${new Date(events.startDate).getFullYear()}`;
            const eventEndDate = `${new Date(events.endDate).getDate()}/${new Date(events.endDate).getMonth()}/${new Date(events.endDate).getFullYear()}`;
            // PDF Parameters
            // All what we need to display in the QRCode
            const pdfParameters = {
                userName: user.fName,
                eventName: events.name,
                startDate: eventStartDate,
                startTime: events.startTime,
                endDate: eventEndDate,
                endTime: events.endTime,
                location: events.location,
                qrCodeLink: `http://localhost:3000/uploads/QRCodes/${user._id}.png`
            };

            // Create File HTML and render it (then this will be convert to pdf)
            const pdfTemplate = fs.readFileSync(path.resolve('./mailTemplates', 'reservation.html'), { encoding: 'utf-8' });
            const htmlToConvert = ejs.render(pdfTemplate, pdfParameters);
            // Data to send to pdf file
            const pdfData = {
                html: htmlToConvert,
                data: {},
                path: "./uploads/Reservations/"+user._id+".pdf",
                type: "",
            };
            // Pdf options
            let pdfOptions = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };

            // send email 

            // envoyer ticket via email 

            pdf.create(pdfData, pdfOptions).then( async (pdfCreated) => {

                    const message = {
                        from: 'FivePoints@gmail.com', // sender address
                        to: 'rochdi.bouhlel@hotmail.fr', //user.email, // list of receivers
                        subject: "Confirmation reservation", // Subject line
                        html: '<h1>Get ticket</h1>', // html body
                        attachments: [{ // we send the file as an attachment not as html file us usually
                                filename: 'Ticket.pdf',
                                content: fs.createReadStream(pdfData.path)
                        }]
                    };
                    await transport.sendMail(message);
                res.status(200).json({ message: 'Ckeck your mail!' });
            });
            // diminuer le nombre de ticket
            await eventSchema.findByIdAndUpdate(req.params.id, { $inc: { availableTicketNumber: -1} }, {new: true});
            // 3. response 
        } catch (err) {
            console.log(err)
        }
    }
});


module.exports = router;