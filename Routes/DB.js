const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const database = client.db('GuessTheGame');
const users = database.collection('users');
const games = database.collection('games');

const collections = {
    users,
    games
}

module.exports = collections;