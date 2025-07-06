/**
 * 🔌 OpenRouter Provider
 * Handles calling the OpenRouter API with any text + instruction.
 * Expects to be initialized with API key and model via `setup()`.
 */

let API_KEY = null;
let MODEL = null;

/**
 * Sets up provider configuration.
 * @param {Object} options
 * @param {string} options.apiKey - your OpenRouter API key
 * @param {string} options.model - model name (e.g. deepseek-chat-v3-0324)
 */
export function setup({ apiKey, model }) {
  API_KEY = apiKey;
  MODEL = model;
}

/**
 * Calls the OpenRouter LLM API with custom instruction and text.
 * @param {string} text - user-selected input text
 * @param {string} instruction - task prompt (e.g. summarize, translate)
 * @returns {Promise<string>} - model's reply
 */
export async function llmCall(text, instruction) {
  if (!API_KEY || !MODEL) throw new Error("OpenRouter provider not initialized");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${instruction}\n\n${text}` }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok || !data.choices || !data.choices[0]?.message?.content) {
    console.error("OpenRouter API error:", data);
    return "⚠️ LLM request failed or returned no response.";
  }

  return data.choices[0].message.content.trim();
}
