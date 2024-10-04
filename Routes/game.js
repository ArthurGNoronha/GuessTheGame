const router = require('express').Router();
const { ObjectId } = require('mongodb');
const collections = require('../routes/db.js');

router.get('/', (req, res) => {
    res.render('user');
});

router.post('/gamePage', async (req, res) => {
    try {
        const name = req.body.user;
        
        let randomGames = await collections.games.aggregate([{ $sample: { size: 3 } }]).toArray();
        let highScore = await collections.users.find().sort({ score: -1 }).limit(1).toArray();
        

        req.session.games = randomGames;
        req.session.user = name;
        req.session.currentGameIndex = 0;
        req.session.score = 0;
        
        res.render('index', { highScore: highScore.length > 0 ? highScore[0] : null });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/random-game', async (req, res) => {
    try {
        if (!req.session.games || req.session.currentGameIndex === undefined) {
            return res.status(400).json({ error: 'Nenhum jogo encontrado. Tente reiniciar a sessão.' });
        }

        const currentIndex = req.session.currentGameIndex;
        
        if (currentIndex >= 3) {
            await collections.users.insertOne({ name: req.session.user, score: req.session.score });

            res.json({ fim: true, score: req.session.score });
            return;
        }

        const game = req.session.games[currentIndex];
        const image = game.images[0];

        req.session.currentGameIndex += 1;

        res.json({ image, gameId: game._id });
    } catch (error) {
        console.error('Erro ao carregar jogo:', error);
        res.status(500).json({ error: 'Erro ao carregar jogo' });
    }
});

router.post('/game/:id/guess', async (req, res) => {
    const { guess, attempt } = req.body;
    const gameId = req.params.id;
  
    try {

        const game = await collections.games.findOne({ _id: new ObjectId(gameId) });

        if (guess.toLowerCase() === game.gameName.toLowerCase()) {
            const points = 10 - parseInt(attempt);
            req.session.score += points;

            return res.json({ 
                correct: true,
                gameName: game.gameName,
                images: game.images,
                score: req.session.score
            });
        } else {
            const nextImageIndex = parseInt(attempt) + 1;
            if (nextImageIndex >= 5) {
                return res.json({ 
                    limite: true,
                    correct: false,
                    gameName: game.gameName,
                    images: game.images,
                    score: req.session.score
                });
            }

            return res.json({
                correct: false,
                image: game.images[nextImageIndex] || game.images[4],
                images: game.images,
                score: req.session.score
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar a tentativa' });
    }
});

module.exports = router;