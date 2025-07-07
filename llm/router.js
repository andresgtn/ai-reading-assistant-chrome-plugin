/**
 * router.js (v1.1-public)
 *
 * Clean version that skips provider wiring and calls the secure proxy directly.
 * This version removes all setup/delegation logic — only supports proxy.
 */

import { PROVIDERS, DEFAULT_PROVIDER } from "./config.js";

/**
 * Call the LLM via proxy (no local key, no provider setup)
 * @param {string} text - main user content
 * @param {string} instruction - task to perform
 * @param {string} [providerId=DEFAULT_PROVIDER]
 * @returns {Promise<string>} assistant’s reply or fallback error
 */
export async function llmCall(text, instruction, providerId = DEFAULT_PROVIDER) {
  const model = PROVIDERS[providerId]?.defaultModel;

  if (!model) {
    return `Error: No model configured for provider "${providerId}"`;
  }

  try {
    const response = await fetch("https://your-vercel-deployment-url/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, instruction, model })
    });

    const data = await response.json();

    if (!response.ok || !data.content) {
      console.error("Proxy LLM error:", data);
      return "⚠️ LLM request failed or returned no usable response.";
    }

    return data.content;
  } catch (err) {
    console.error("Router LLM proxy error:", err);
    return "⚠️ LLM proxy call failed.";
  }
}

/**
 * List of available providers (UI use)
 */
export function getAvailableProviders() {
  return Object.entries(PROVIDERS).map(([id, meta]) => ({ id, ...meta }));
}
