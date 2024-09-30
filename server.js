const express = require('express');
const middleware = require('./Routes/middleware.js');
const game = require('./routes/game.js');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './Pages');

app.use(express.json());
app.use(middleware);
app.use('/', game);

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});