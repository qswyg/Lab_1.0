const express = require('express');
const cors = require('cors');


const usersRoutes = require('./routes/users.routes');
const notesRoutes = require('./routes/notes.routes');


const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[API LOG]: ${req.method} ${req.url}`);
    next();
});


app.use('/api/users', usersRoutes);
app.use('/api/notes', notesRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});