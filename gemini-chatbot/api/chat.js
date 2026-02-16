// Vercel Serverless Function for Google Gemini API
export default async function handler(req, res) {
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
      console.error('GEMINI_API_KEY not found in environment');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build conversation context
    let prompt = '';
    
    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      // Include last 10 messages for context
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

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
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
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI',
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Extract the text response
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not generate a response.';

    console.log('Success! Response generated');

    return res.status(200).json({ 
      response: aiResponse,
      emotion: analyzeEmotion(aiResponse)
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

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

