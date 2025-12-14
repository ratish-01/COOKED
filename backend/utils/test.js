import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment (.env)');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "models/gemma-3-1b-it",
    });

  console.log('Calling generateContent...');

  async function generateWithRetry(model, input, maxAttempts = 5) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await model.generateContent(input);
        return res;
      } catch (err) {
        const status = err?.status;
        const isTransient = status === 429 || status === 503;
        console.warn(`generateContent attempt ${attempt} failed${status ? ` (status ${status})` : ''}`);
        if (!isTransient || attempt === maxAttempts) throw err;
        
        const backoff = Math.min(1000 * 2 ** (attempt - 1), 10000);
        console.log(`Retrying in ${backoff}ms...`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }
  }

  const result = await generateWithRetry(model, "Hello COOKING CREATOR, testing Gemini!");
  console.log('generateContent returned');

  const candidateText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("Gemini Response candidate:", candidateText || JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("Gemini Error:", err);
  }
}

run();
