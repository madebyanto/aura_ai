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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore OpenAI:', data);
      return res.status(500).json({ error: "Errore da OpenAI", dettagli: data });
    }

    res.json({ reply: data.choices[0].message.content });
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
