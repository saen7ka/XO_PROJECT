import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/xo-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const gameSchema = new mongoose.Schema({
  boardSize: Number,
  moves: [
    {
      turn: Number,
      player: String,
      index: Number
    }
  ],
  winner: String,
  timeFinished: Date,
  createdAt: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);

app.post('/games', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ message: 'Game saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
