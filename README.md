🔥 COOKED — Spotify Roast Engine

COOKED is an intelligent web application that analyzes a user’s Spotify listening behavior and generates a humorous, sarcastic personality roast based on their music taste. It processes real-time Spotify data, applies contextual analysis, and produces structured, machine-readable roast outputs.

How To Run This Application

Follow these steps to run the project locally.

1️⃣ Clone the Repository
git clone https://github.com/your-username/COOKED.git
cd COOKED/backend

2️⃣ Install Dependencies

Make sure Node.js is installed.

npm install

3️⃣ Create Environment Variables

Create a .env file inside the backend folder and add:

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
GEMINI_API_KEY=your_gemini_api_key

4️⃣ Setup Spotify Developer App

Go to https://developer.spotify.com/dashboard

Create a new app

Copy Client ID and Client Secret

Add Redirect URI:

http://localhost:5000/callback


Save settings

5️⃣ Start the Server
node server.js


or

npm start


You should see:

Server running on port 5000

6️⃣ Open In Browser

Open:

http://localhost:5000/login


Login with Spotify and enjoy getting cooked 🔥

7️⃣ (Optional) For Development

If you use nodemon:

npm run dev

⚠️ Common Issues

If login fails → check .env values

If Gemini fails → check API key

If Spotify fails → check redirect URI

If tokens expire → refresh endpoint handles it

🛑 To Stop Server

Press:

CTRL + C
🚀 Project Flow

1.User Authentication

    User logs in via Spotify OAuth
    
    Access token and refresh token are securely stored
    
    Session validity is managed with timestamps

2.Data Collection

    Fetches:
    
      *Top tracks
      *Liked songs
      *Recently played tracks
      *Most heard songs
      
    Uses caching to prevent redundant API calls

3.Session & Token Management

    Access tokens auto-refresh using refresh tokens
    
    Login session persists up to 24 hours
    
    Time-based checks trigger refresh reminders

4.Roast Generation

    Spotify data is transformed into a structured prompt
    
    AI generates a sarcastic roast in strict JSON format
    
    Includes:
      *Roast paragraph
      *Scoring metrics
      *Observations & fun facts

5.Parsing & Validation

    Robust JSON parsing with multiple fallbacks
    
    Handles malformed or partial AI responses
    
    Graceful fallback response if generation fails

🧠 Core Features

    *Secure OAuth authentication
    
    *Automatic token refresh handling
    
    *Rate-limit & spam-login protection
    
    *Intelligent caching for performance
    
    *Fault-tolerant AI response parsing
    
    *Structured, API-ready JSON output
    
    *Logout & session invalidation support

🔐 Security & Stability

    *Environment-based secret management
    
    *Token lifecycle validation
    
    *API abuse prevention
    
    *Graceful failure handling

📌 Use Case

      COOKED is ideal as:
      
        *A fun analytics tool
        
        *An example of AI + API orchestration
        
        *A demonstration of robust session management
