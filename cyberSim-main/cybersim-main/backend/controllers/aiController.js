import axios from "axios";

export const askAI = async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: "AI service not configured. Please add GEMINI_API_KEY to .env" 
      });
    }

    const systemPrompt = `You are a cybersecurity tutor for CyberSim, an educational platform. 
Your role is to help students learn cybersecurity concepts through practical simulations.
Be concise, educational, and encouraging. Provide hints rather than direct answers when appropriate.
Focus on: ${context || "general cybersecurity concepts"}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nStudent question: ${question}`
          }]
        }]
      }
    );

    const answer = response.data.candidates[0].content.parts[0].text;

    res.json({ answer });
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "AI service error",
      error: error.response?.data?.error?.message || error.message 
    });
  }
};