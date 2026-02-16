// Vercel Serverless Function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get API key from environment variable
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Building prompt...');

    // Build conversation context
    let prompt = '';
    
    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          prompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          prompt += `Assistant: ${msg.content}\n`;
        }
      });
    }
    
    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    console.log('Calling Gemini API...');

    // Call Google Gemini API with working model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Failed to get response from AI',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    // Extract the text response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    
    const emotion = analyzeEmotion(aiResponse);

    console.log('Success! Sending response');

    return res.status(200).json({ 
      response: aiResponse,
      emotion: emotion
    });

  } catch (error) {
    console.error('Caught error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Simple emotion detection
function analyzeEmotion(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.match(/(happy|joy|excited|wonderful|great|amazing|love|celebration)/)) {
    return 'happy';
  }
  if (lowerText.match(/(sad|sorry|unfortunate|regret|apologize)/)) {
    return 'sad';
  }
  if (lowerText.match(/(wow|incredible|amazing|awesome|fantastic)/)) {
    return 'excited';
  }
  if (lowerText.match(/(hmm|let me think|consider|analyzing)/)) {
    return 'thinking';
  }
  if (lowerText.match(/(not sure|unclear|confusing|don't understand)/)) {
    return 'confused';
  }
  
  return 'neutral';
}
