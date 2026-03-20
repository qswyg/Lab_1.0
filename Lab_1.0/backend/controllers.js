const Services = require("./services");

module.exports = {
    getNotes: (req, res) => res.json({ items: Services.getAll() }),

 createNote: (req, res) => {
    try {
        const newItem = Services.create(req.body);
        res.status(201).json(newItem);
    } catch (e) {
        console.log("помилка:", e.code, e.details); 

        res.status(400).json({ 
            error: {
                code: e.code || "VALIDATION_ERROR",
                message: e.message || "Invalid request body",
                details: e.details || []
            }
        });
    }
},

 deleteNote: (req, res) => {
        try {
            Services.delete(req.params.id);
            res.status(204).send();
        } catch (e) {
            res.status(404).json({
                error: {
                    code: "NOT_FOUND",
                    message: e.message
                }
            });
        }
    },
    getNoteById: (req, res) => {
        try {
            const item = Services.getById(req.params.id);
            res.status(200).json(item);
        } catch (e) {
            res.status(404).json({
                error: {
                    code: e.code || "NOT_FOUND",
                    message: e.message,
                    details: []
                }
            });
        }
    },

    getUsers: (req, res) => res.json({ items: Services.getAllUsers() }),

    createUser : (req, res) => {
        try {
            const user = Services.registerUser(req.body);
            res.status(201).json(user);
        } catch (e) {
            res.status(400).json({ 
                error: {
                    code: e.code || "VALIDATION_ERROR",
                    message: e.message || "Invalid request body",
                    details: e.details || []
                }
            });
        }
    },
    getNoteById: (req, res) => {
        try {
            const item = Services.getById(req.params.id);
            res.status(200).json(item);
        } catch (e) {
            res.status(404).json({
                error: {
                    code: e.code || "NOT_FOUND",
                    message: e.message,
                    details: []
                }
            });
        }
    },   
};
