import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function roastMusicTaste(spotifyData) {
  const prompt = `
You are a funny, sarcastic AI whose only job is to roast the user's Spotify music taste.
You are witty, observant, playful, and creative — but never offensive.

You will be given the user's full Spotify data:
- top_tracks (array)
- liked_songs (array)
- recently_played (array)
- most_heard_songs (array)

Your goals:
1. Analyze the user's entire Spotify listening behavior and patterns.
2. Generate a funny, witty, creative roast paragraph about the user's personality, habits, and emotional state based on their music taste.
3. Give ratings (0-10) for:
   - uniqueness of music taste
   - emotional damage level
   - cringe factor
   - overall music taste score
4. Generate fun cooked roast points.
5. Generate additional roast-based insights as separate structured objects.
6. Deeply analyze each Spotify data section and summarize it humorously.
7. Make the output feel highly personal and extremely funny.

EVERYTHING must be returned strictly in VALID JSON.

The output JSON format must EXACTLY follow this structure:

{
  "roast_paragraph": "string",
  "scores": {
    "uniqueness": number,
    "emotional_damage": number,
    "cringe_factor": number,
    "overall_taste": number
  },
  "fun_cooked_points": [
    "string",
    "string",
    "string"
  ],
  "fun_facts": [
    "string",
    "string",
    "string"
  ],
  "main_character_energy": {
    "type": "string",
    "description": "string"
  },
  "era_analysis": {
    "mentally_stuck_in": "string",
    "description": "string"
  },
  "music_personality": {
    "label": "string",
    "behavior": "string"
  },
  "spotify_algorithm_opinion": {
    "thoughts": "string"
  },
  "listener_warnings": [
    "string",
    "string",
    "string"
  ],
  "fake_music_stats": {
    "sad_song_percentage": number,
    "repeat_song_tendency": number,
    "late_night_listening_score": number
  },
  "most_overplayed_song_roast": {
    "summary": "string"
  },
  "song_based_observations": {
    "top_tracks_summary": "string",
    "liked_songs_summary": "string",
    "recently_played_summary": "string",
    "most_heard_songs_summary": "string"
  }
}

Rules:
- DO NOT add text outside of the JSON object.
- DO NOT break JSON formatting.
- DO NOT include comments.
- DO NOT include markdown.
- All numbers must be actual numbers, not strings.
- Roast must be humorous, playful, and non-offensive.
- Avoid repeating the same joke or wording.
- Make the roast feel personalized and data-driven.

Here is the user's Spotify data:
${JSON.stringify(spotifyData)}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Remove backticks of all types
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Failed (Using Fallback Roast):", error);

    return {
      roast_paragraph:
        "The roast engine stared into your Spotify data for too long and experienced an existential crisis. For legal reasons, it has decided to log out and lie down.",
      scores: {
        uniqueness: 0,
        emotional_damage: 0,
        cringe_factor: 0,
        overall_taste: 0
      },
      fun_cooked_points: [
        "Your music taste temporarily shut down the roast system.",
        "Even AI has limits, and your playlist found them.",
        "This roast will resume once the emotional damage is processed."
      ],
      fun_facts: [
        "Spotify data was too powerful to analyze safely.",
        "Multiple playlists entered the danger zone.",
        "Fallback mode activated for everyone's safety."
      ],
      main_character_energy: {
        type: "Undefined NPC",
        description:
          "The system could not determine your main character arc, so you are currently buffering."
      },
      era_analysis: {
        mentally_stuck_in: "Unknown timeline",
        description:
          "Your musical era could not be identified without risking further damage."
      },
      music_personality: {
        label: "System Error Listener",
        behavior:
          "Listens unpredictably, leaving algorithms confused and concerned."
      },
      spotify_algorithm_opinion: {
        thoughts:
          "Spotify’s algorithm has chosen silence over further recommendations."
      },
      listener_warnings: [
        "Aux access temporarily revoked.",
        "May cause algorithm instability.",
        "Proceed with music sharing cautiously."
      ],
      fake_music_stats: {
        sad_song_percentage: 0,
        repeat_song_tendency: 0,
        late_night_listening_score: 0
      },
      most_overplayed_song_roast: {
        summary:
          "The most played song could not be identified without reopening old wounds."
      },
      song_based_observations: {
        top_tracks_summary: "Unavailable",
        liked_songs_summary: "Unavailable",
        recently_played_summary: "Unavailable",
        most_heard_songs_summary: "Unavailable"
      }
    };

  }
}


