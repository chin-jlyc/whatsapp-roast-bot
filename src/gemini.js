// src/gemini.js
// Handles integration with Google's Gemini API for roasting business ideas

require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// Initialize the Gemini API with the API key from environment variables
const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    console.warn(
      "⚠️ GEMINI_API_KEY not set in .env file. Gemini functionality will not work."
    );
    return null;
  }

  return new GoogleGenAI({ apiKey });
};

/**
 * Roasts a business idea using Gemini AI
 * @param {string} businessIdea - The business idea to roast
 * @returns {Promise<string>} - The roasted response
 */
const roastBusinessIdea = async (businessIdea) => {
  const genAI = initGemini();

  if (!genAI) {
    return "Sorry, I can't roast your idea right now. My roasting capabilities are offline. (API key not configured)";
  }

  try {
    // Use the gemini-2.0-flash model for faster responses
    const model = genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a sarcastic and witty business critic who roasts business ideas. 
Your responses should be funny, slightly edgy, but not cruel.
Roast this business idea in 2-3 short paragraphs:
"${businessIdea}"

Make sure your response is concise, entertaining, and points out potential flaws 
or absurdities in the idea while still being somewhat constructive.

Please answer in the same language as the business idea.`,
    });

    const response = await model;
    return response.text.trim();
  } catch (error) {
    console.error("Error roasting business idea with Gemini:", error);
    return `Sorry, I couldn't properly roast your idea. My roasting circuits are overheating. Technical error: ${error.message}`;
  }
};

module.exports = {
  roastBusinessIdea,
};
