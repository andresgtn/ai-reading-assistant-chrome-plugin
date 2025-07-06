/**
 * 🧠 Provider registry for dynamic routing.
 * Each provider must have a folder under /llm/<id>/provider.js
 */

export const PROVIDERS = {
  openrouter: {
    name: "OpenRouter",
    description: "Fast, multi-model access (e.g. DeepSeek, GPT-4o)",
    defaultModel: "deepseek/deepseek-chat-v3-0324:free"
  },
  groq: {
    name: "Groq",
    description: "Ultra-fast open models like LLaMA3",
    defaultModel: "llama3-70b-8192"
  },
  together: {
    name: "Together.ai",
    description: "Affordable access to open-source models",
    defaultModel: "mistralai/Mixtral-8x7B-Instruct-v0.1"
  }
};

// 🌐 Default provider to use if none is selected explicitly
export const DEFAULT_PROVIDER = "openrouter";
