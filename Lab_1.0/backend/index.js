const express = require("express");
const cors = require("cors");
const Controllers = require("./controllers"); 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/notes", Controllers.getNotes);
app.post("/api/notes", Controllers.createNote);
app.delete("/api/notes/:id", Controllers.deleteNote);
app.get("/api/users", Controllers.getUsers);
app.post("/api/users", Controllers.createUser);
app.get("/api/notes/:id", Controllers.getNoteById);

app.use((req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: `Route ${req.originalUrl} not found`,
            details: []
        }
    });
});
app.listen(3000, () => {
    console.log("Сервер запущено: http://localhost:3000");
});