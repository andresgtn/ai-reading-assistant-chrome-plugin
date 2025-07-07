# AI Reading Assistant - Chrome Extension

(This branch implements the same functionality as the main branch, but changes how we serve the model, to hide api tokesn from Openrouter, so we can publish it to the Chrome extensions public library.)

A Chrome extension that allows users to highlight text on any webpage and send it to an LLM for summarizing, paraphrasing, explaining, or translating via OpenRouter.

## 🔗 Public API Endpoint

`https://ai-reading-proxy-f99gvkwf1-andres-alguimcoms-projects.vercel.app/api/chat`

## 🧩 Request Format

Send a `POST` request with the following JSON structure:

```json
{
  "text": "What is the capital of France?",
  "instruction": "Answer very concisely.",
  "model": "deepseek/deepseek-chat-v3-0324:free"
}
```

## 🧪 Example (cURL)

```bash
curl -X POST https://ai-reading-proxy-f99gvkwf1-andres-alguimcoms-projects.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is the capital of France?",
    "instruction": "Answer very concisely.",
    "model": "deepseek/deepseek-chat-v3-0324:free"
  }'
```

## 🔐 API Key

The OpenRouter API key is securely stored as a server-side environment variable (`OPENROUTER_API_KEY`) and never exposed to clients.

## 📦 Purpose

This branch (`v1.1-public`) is designed to:
- Safely expose a public API without leaking your OpenRouter key
- Serve the Chrome extension in production
- Remove all dev-only or local dependencies
