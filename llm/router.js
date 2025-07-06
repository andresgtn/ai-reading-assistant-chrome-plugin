/**
 * router.js
 *
 * This file routes LLM calls to the selected provider.
 * Because dynamic import() is not allowed in Chrome service workers,
 * all providers must be statically imported and registered manually below.
 *
 * RULE: When adding a new provider, do ALL THREE:
 * (we have to, as chrome didnt allow us to keep our original architecture
 * which was able to automatically load a model based on a provider in
 * the config file..so we have to do it this other way now.. for now)
 *
 * 1. Create the provider file:        llm/<provider>/provider.js
 * 2. Add a static import here:        import * as <name> from './<provider>/provider.js'
 * 3. Register it below in the map:    const PROVIDER_MODULES = { ... }
 *
 * Example:
 * import * as openrouter from './openrouter/provider.js';
 * const PROVIDER_MODULES = { openrouter };
 *
 * Each provider must export:
 * - setup({ apiKey, model })
 * - llmCall(text, instruction)
 */


import { PROVIDERS, DEFAULT_PROVIDER } from "./config.js";
import { API_KEYS } from "./secrets.js";

// ✅ CHANGED: Static imports for known providers
//TODO: figure out how we can go back to the old way of not having to declare each provider explicitly
// but we cant do live imports in modules in chrome, like: mod = await import(`./${providerId}/provider.js`);
import * as openrouter from "./openrouter/provider.js";

// ✅ CHANGED: Static provider map
const PROVIDER_MODULES = {
  openrouter,
};

// ✅ CHANGED: Pre-configure each provider once (no dynamic import)
const cache = {};

function setupProvider(providerId) {
  if (cache[providerId]) return cache[providerId];

  const mod = PROVIDER_MODULES[providerId];
  if (!mod) return null;

  const apiKey = API_KEYS[providerId];
  const model = PROVIDERS[providerId]?.defaultModel;

  if (typeof mod.setup === "function") {
    mod.setup({ apiKey, model });
  }

  cache[providerId] = mod;
  return mod;
}

/**
 * Call the active provider with text and instruction.
 * @param {string} text
 * @param {string} instruction
 * @param {string} [providerId]
 * @returns {Promise<string>}
 */
export async function llmCall(text, instruction, providerId = DEFAULT_PROVIDER) {
  const provider = setupProvider(providerId);

  if (!provider || typeof provider.llmCall !== "function") {
    return "Error: selected LLM provider is unavailable or misconfigured.";
  }

  return await provider.llmCall(text, instruction);
}

/**
 * Return list of available providers (for UI or settings use).
 */
export function getAvailableProviders() {
  return Object.entries(PROVIDERS).map(([id, meta]) => ({ id, ...meta }));
}
