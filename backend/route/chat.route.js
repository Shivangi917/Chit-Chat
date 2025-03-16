const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
const API_KEY = process.env.HF_API_KEY;

// Function to retry the request with a delay
const retryRequest = async (url, data, headers, retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, data, { headers });
      return response;
    } catch (error) {
      if (error.response?.status === 503 && i < retries - 1) {
        console.log(`Model is loading. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await retryRequest(
      HUGGING_FACE_API_URL,
      {
        inputs: message, // Send the message directly as a string
      },
      {
        Authorization: `Bearer ${API_KEY}`,
      }
    );

    console.log('Hugging Face API Response:', response.data);

    // Extract the AI's reply from the response
    const aiReply = response.data[0]?.generated_text || 'Sorry, no response from AI.';
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Error communicating with Hugging Face API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
});

module.exports = router;