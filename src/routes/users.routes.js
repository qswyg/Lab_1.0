const express = require('express');
const router = express.Router();
const usersRepo = require('../repositories/usersRepo');

router.post('/', async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ status: "error", message: "Ім'я та email обов'язкові" });
        }

        const existingUser = await usersRepo.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                status: "error", 
                message: "Користувач із таким email вже існує" 
            });
        }

        const id = await usersRepo.createUser(req.body);
        res.status(201).json({ status: "success", data: { id, ...req.body } });
    } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
    try {
        const users = await usersRepo.getAllUsers();
        res.json({ status: "success", data: users });
    } catch (err) { next(err); }
});

module.exports = router;