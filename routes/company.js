const express = require('express');
const companySchema = require('../models/companySchema');
const router = express.Router();


router.get('/company', async (req, res) => {
    const company = await companySchema.find();
    res.json(company);
});


//get with Populate
router.get('/fullCompany', async (req, res) => {
    const eventCompany = await companySchema.populate(); //afficher avec les event associer
    res.json(eventCompany);
});


//Find One By ID
router.get('/company/:id', async (req, res) => {
    // const company = await companySchema.findOne({ id: req.params.id}); the same result with other way
    const company = await companySchema.findById(req.params.id);
    res.json(company);
})


router.post('/company', async (req, res) => {
    const company = await companySchema.create(req.body);
    res.json(company);
});


router.put('/company/:id', async (req, res) => {
    const company = await companySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(company);
});


router.delete('/company/:id', async (req, res) => {
    const company = await companySchema.findByIdAndDelete(req.params.id);
    res.json({ message: `The company ${company.name} deleted successfully!` });
});


module.exports = router;