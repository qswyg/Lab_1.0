const express = require('express');
const router = express.Router();
const categoriesRepo = require('../repositories/categoriesRepo');

router.get('/', async (req, res) => {
    try {
        const categories = await categoriesRepo.getAllCategories();
        res.json({ data: categories });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const id = await categoriesRepo.createCategory(req.body.name);
        res.status(201).json({ id, name: req.body.name });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;