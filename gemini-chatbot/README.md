# 🤖 Gemini-Powered Expressive Chatbot

An intelligent AI chatbot with emotions, voice, and memory - powered by **Google Gemini AI**!

## ✨ Features

### 🧠 AI Intelligence
- **Real AI responses** via Google Gemini
- Answers ANY question (weather, math, facts, creative tasks)
- Remembers conversation context
- Natural, human-like conversations

### 🎭 Expressions & Emotions
- 6 different character emotions (happy, sad, neutral, excited, thinking, confused)
- AI automatically shows appropriate emotion
- Upload your own character images

### 🔊 Voice Features
- **Text-to-Speech** with customizable voice
- **Voice presets**: Child, Teen, Adult, Mature, Robot
- **Pitch & speed control** (fine-tune the voice)
- **Auto-speak** responses
- **Stop button** to interrupt speech
- **Emoji filtering** (doesn't speak emojis)

### 💾 Memory & History
- **Remembers your name** permanently
- **Chat history** saves last 10 conversations
- **Conversation context** (last 10 messages)
- Survives page refresh

### 🎨 Customization
- **Dark mode** toggle
- **Timestamps** on all messages
- **Mobile optimized** (works on phones/tablets)
- Fully responsive design

---

## 🚀 Quick Start

### 1. Get Google Gemini API Key
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy your key (starts with `AIza...`)

### 2. Deploy to Vercel
1. Download and unzip the project files
2. Go to https://vercel.com/new
3. Drag the folder to Vercel
4. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: [Your API key]
5. Click "Deploy"

**Done!** Your AI chatbot is live! 🎉

**Detailed instructions:** See `DEPLOYMENT.md`

---

## 💬 Example Conversations

```
You: What's 127 * 456?
AI: 127 * 456 = 57,912

You: Write a haiku about cats
AI: Soft paws tread softly
   Whiskers twitch at moonlit mice
   Purrs fill the night air

You: What's the capital of Japan?
AI: The capital of Japan is Tokyo...

You: My name is Sarah
AI: Nice to meet you, Sarah! I'll remember that...

You: What's my name?
AI: Your name is Sarah. How could I forget? 😊
```

---

## 📁 Project Structure

```
gemini-chatbot/
├── index.html          # Frontend (58KB)
├── api/
│   └── chat.js         # Serverless API endpoint
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
├── .env.example        # Environment variable template
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # This file
```

---

## 🔧 Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI:** Google Gemini Pro API
- **Backend:** Vercel Serverless Functions (Node.js)
- **Hosting:** Vercel Edge Network
- **Storage:** Browser localStorage (for history & preferences)
- **Voice:** Web Speech API

---

## 🎯 API Usage

### Free Tier (Google Gemini)
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

**Perfect for personal use!** You'll rarely hit limits.

---

## 🔒 Security

- ✅ API key stored securely in environment variables
- ✅ Not exposed to frontend
- ✅ HTTPS encryption
- ✅ CORS protection

---

## 🎨 Customization Options

### Change AI Personality
Edit the prompt in `api/chat.js` to customize behavior

### Adjust Response Style
Modify `temperature` setting (0.1-1.5) for more/less creative responses

### Custom Voice
Use voice presets or adjust pitch/speed sliders

### Custom Emotions
Upload your own character images for each emotion

---

## 📱 Browser Support

- ✅ Chrome/Edge (full features including voice)
- ✅ Safari (TTS only, no voice input)
- ✅ Firefox (TTS only)
- ✅ Mobile browsers (works great!)

---

## 🐛 Troubleshooting

**Problem:** AI not responding  
**Solution:** Check API key in Vercel environment variables

**Problem:** "Rate limit exceeded"  
**Solution:** Wait 1 minute (free tier: 15 req/min)

**Problem:** Voice not working  
**Solution:** Needs HTTPS (Vercel provides this automatically)

See `DEPLOYMENT.md` for more troubleshooting tips.

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🙏 Credits

- **AI:** Google Gemini Pro
- **Hosting:** Vercel
- **Voice:** Web Speech API
- **Design:** Custom responsive UI

---

## 🌟 Version History

**v2.0** (Current) - Gemini AI Integration
- Real AI responses
- Context-aware conversations
- Intelligent emotion detection

**v1.12** - Feature Complete
- All manual features
- Pattern-based responses
- Local operation

---

**Enjoy your intelligent AI chatbot!** 🤖✨

For detailed deployment instructions, see `DEPLOYMENT.md`
