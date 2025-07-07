// /api/chat.js
// Vercel serverless function that securely forwards chat requests to the OpenRouter API.
// It prevents exposing your OpenRouter API key by injecting it server-side.


export default async function handler(req, res) {

  # DEBUG
  console.log("ENV KEY:", process.env.OPENROUTER_API_KEY ? "loaded" : "MISSING");
  
  // Allow only POST requests; reject anything else
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Destructure expected fields from the incoming request body
  const { text, instruction, model } = req.body;

  // Validate that all required fields are present
  if (!text || !instruction || !model) {
    return res.status(400).json({ error: 'Missing required fields: text, instruction, model' });
  }

  try {
    // Prepare and send the request to OpenRouter's Chat Completions API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // Inject your OpenRouter API key from Vercel environment variable
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model, // e.g. "deepseek/deepseek-chat-v3-0324:free"
        messages: [
          { role: "system", content: "You are a helpful assistant." }, // baseline behavior
          { role: "user", content: `${instruction}\n\n${text}` }       // user prompt
        ]
      })
    });

    // Parse the JSON response
    const data = await response.json();

    // Handle edge cases: malformed response or no content returned
    if (!response.ok || !data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenRouter API error:", data);
      return res.status(502).json({ error: "LLM request failed or returned no response." });
    }

    // Return only the assistant's reply as a clean string
    return res.status(200).json({ content: data.choices[0].message.content.trim() });

  } catch (err) {
    // Catch unexpected runtime errors (network, JSON issues, etc.)
    console.error("Proxy server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

