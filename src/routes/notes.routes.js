const express = require('express');
const router = express.Router();
const notesRepo = require('../repositories/notesRepo');


router.get('/', async (req, res, next) => {
    try {
        const notes = await notesRepo.getAllNotes(req.query);
        res.json({ status: "success", data: notes });
    } catch (err) { next(err); }
});


router.get('/stats', async (req, res, next) => {
    try {
        const stats = await notesRepo.countNotesByCategory();
        res.json({ status: "success", data: stats });
    } catch (err) { next(err); }
});

router.get('/vulnerable-search', async (req, res, next) => {
    try {
        const results = await notesRepo.searchNotesVulnerable(req.query.q);
        res.json({ status: "success", data: results, note: "This endpoint is intentionally vulnerable to SQLi" });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const note = await notesRepo.getNoteById(req.params.id);
        if (!note) {
            return res.status(404).json({ status: "error", message: "Нотатку не знайдено" });
        }
        res.json({ status: "success", data: note });
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const id = await notesRepo.createNote(req.body);
        res.status(201).json({ status: "success", data: { id, ...req.body } });
    } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
    try {
        await notesRepo.updateNote(req.params.id, req.body);
        res.json({ status: "success", message: "Оновлено успішно" });
    } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await notesRepo.deleteNote(req.params.id);
        res.status(204).send();
    } catch (err) { next(err); }
});

module.exports = router;