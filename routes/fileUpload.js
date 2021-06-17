const express = require('express')
const router = express.Router();
const multer = require('multer')
const path = require('path');
// const upload = multer({ dest: 'Uploads/' })

// router.post('/upload', upload.single('avatar'), async (req, res) => {
//     res.json({ message: 'file uploaded successfuly' });
// });


router.post('/uploads', uploads.single('photo') ,  (req, res) => {
    if(req.file != undefined){
        res.json({ message : 'image uploaded successfuly!'});
    }
    else
    res.status(400).json({ message : 'file not supported .. only images are accepted'})
    
});

module.exports = router;
