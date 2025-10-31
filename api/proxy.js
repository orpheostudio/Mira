
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Loads .env file into process.env

const app = express();
const port = process.env.PORT || 3001;

// --- Middlewares ---
// Enable CORS for all routes. For production, you should restrict this
// to your frontend's domain: app.use(cors({ origin: 'https://your-frontend-domain.com' }));
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// --- Environment Variable Check ---
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
if (!MISTRAL_API_KEY || MISTRAL_API_KEY === 'YOUR_MISTRAL_API_KEY_HERE') {
  console.error('FATAL ERROR: MISTRAL_API_KEY is not set in the .env file.');
  console.error('Please create a .env file in the /api directory and add your key.');
  process.exit(1); // Exit if the key is not configured
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// --- API Route ---
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Request body must contain a "messages" array.' });
  }

  try {
    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: messages, // Pass the conversation history from the frontend
      }),
    });

    // If Mistral API returns an error, forward it to the client
    if (!mistralResponse.ok) {
        const errorData = await mistralResponse.text();
        console.error('Error from Mistral API:', mistralResponse.status, errorData);
        return res.status(mistralResponse.status).send(errorData);
    }

    const data = await mistralResponse.json();
    res.json(data);

  } catch (error) {
    console.error('Error in proxy server:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`SENA backend proxy server listening on port ${port}`);
  console.log(`Ready to receive requests at http://localhost:${port}/api/chat`);
});
