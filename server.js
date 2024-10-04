const express = require('express');
const middleware = require('./Routes/middleware.js');
const game = require('./routes/game.js');
const session = require('express-session');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './Pages');

app.use(express.json());
app.use(session({
    secret: 'fortnite',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(middleware);
app.use('/', game);

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});