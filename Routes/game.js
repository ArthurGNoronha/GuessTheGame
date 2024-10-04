const router = require('express').Router();
const { ObjectId } = require('mongodb');
const collections = require('../routes/db.js');
const express = require('express');

// router.get('/', (req, res) => {
//     try {
//         res.render('index');
//     } catch(error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get('/', (req, res) => {
    res.render('user');
});

router.post('/gamePage', async (req, res) => {
    try {
        const name = req.body.user;
        await collections.users.insertOne({ name });
        res.render('index');
    } catch (error) {
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
    const { guess, attempt } = req.body;
    const gameId = req.params.id;
  
    try {

        const game = await collections.games.findOne({ _id: new ObjectId(gameId) });

        if (guess.toLowerCase() === game.gameName.toLowerCase()) {
            return res.json({ 
                correct: true,
                gameName: game.gameName,
                images: game.images
            });
        } else {
            const nextImageIndex = parseInt(attempt) + 1;
            if (nextImageIndex >= 5) {
                return res.json({ 
                    limite: true,
                    correct: false,
                    gameName: game.gameName,
                    images: game.images
                });
            }

            return res.json({
                correct: false,
                image: game.images[nextImageIndex] || game.images[4],
                images: game.images
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar a tentativa' });
    }
});

module.exports = router;