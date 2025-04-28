const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`  // Usa la tua chiave API di Hugging Face
      },
      body: JSON.stringify({
        inputs: userMessage,  // Il messaggio dell'utente che invii
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore Hugging Face:', data);
      return res.status(500).json({ error: "Errore da Hugging Face", dettagli: data });
    }

    res.json({ reply: data[0].generated_text });  // Restituisce la risposta generata dal modello
  } catch (error) {
    console.error('Errore interno server:', error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

app.get('/', (req, res) => {
  res.send('Server online!');
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
