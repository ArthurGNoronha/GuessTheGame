const router = require('express').Router();
const { ObjectId } = require('mongodb');
const collections = require('../routes/db.js');

router.get('/', (req, res) => {
    try {
        res.render('index');
    } catch(error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/random-game', async (req, res) => {
    try {
        const game = await collections.games.aggregate([{ $sample: { size: 1 } }]).next();
        const image = game.images[0];
    
        res.json({ image, gameId: game._id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar jogo' });
    }
});

router.post('/game/:id/guess', async (req, res) => {
    const { guess, attempt, userName } = req.body;
    const gameId = req.params.id;
  
    try {
        const game = await db.games.findOne({ _id: ObjectId(gameId) });
    
        if (!game) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }
    
        if (guess.toLowerCase() === game.gameName.toLowerCase()) {
            const points = [100, 80, 60, 40, 20][attempt] || 0;
    
            const user = await db.users.findOneAndUpdate(
            { userName },
            {
                $inc: { totalScore: points },
                $push: { gamesPlayed: { gameId: ObjectId(gameId), score: points, attempts: attempt + 1 } }
            },
            { upsert: true, returnDocument: 'after' }
            );
    
            return res.json({ message: `Você acertou! Ganhou ${points} pontos.`, correct: true, totalScore: user.totalScore });
        } else {
            const nextImageIndex = attempt + 1;
            if (nextImageIndex >= game.images.length) {
                return res.json({ message: 'Você perdeu! As tentativas acabaram.', correct: false });
            }

            res.json({
                message: 'Tente novamente!',
                correct: false,
                image: game.images[nextImageIndex]
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar a tentativa' });
    }
});

module.exports = router;