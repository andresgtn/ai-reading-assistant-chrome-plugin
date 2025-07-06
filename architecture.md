# AI Reading Assistant – Project Architecture

This document describes the modular structure of the Chrome extension, including its file layout and component responsibilities.

---

## Project Structure

```
gpt-reader-assistant/
├── manifest.json               # Chrome extension manifest (v3)
├── background/
│   ├── background.js           # Registers context menus and forwards events
│   └── commands.js             # Handles shortcuts, maps commands to LLM instructions
├── content/
│   └── content.js              # Injected into all pages; handles selection + displays results
├── llm/
│   ├── config.js               # Lists available providers and default model
│   ├── router.js               # Routes LLM calls to the correct provider
│   ├── secrets.js              # (Git-ignored) Stores API keys
│   ├── secrets.template.js     # Example key config for setup
│   └── openrouter/
│       └── provider.js         # Connects to OpenRouter API (DeepSeek, etc.)
├── ui/
│   ├── popup.html              # Placeholder for future UI (not used)
│   ├── popup.js                # Placeholder
│   ├── popup.css               # Placeholder styling
│   └── overlay.js              # Placeholder for future result injection
├── utils/
│   └── messaging.js            # Placeholder for messaging abstraction (currently unused)
├── icons/
│   └── icon.png                # Used in Chrome toolbar and store listing
├── README.md                   # Project setup and usage instructions
├── architecture.md             # This file
├── .gitignore                  # Git version control exclusions
```

---

## Flow Summary

```
[User selects text]
     ↓
Triggers:
- context menu (background.js)
- or keyboard shortcut (commands.js)
     ↓
commands.js maps command to instruction
     ↓
Gets selected text from content.js
     ↓
Sends to router.js → provider.js → OpenRouter API
     ↓
Response is sent back to content.js
     ↓
Injected into the page as a floating result box
```

---

## Module Responsibilities

### background/
- `background.js`: Registers context menu items and delegates to `handleCommand()`.
- `commands.js`: Handles all commands (keyboard/context), maps them to instructions, and sends/receives messages to the content script.

### content/
- `content.js`: Handles two actions:
  - `getSelectedText`: returns `window.getSelection().toString()`
  - `showResult`: injects a result box directly into the page (currently handles both logic and UI)

### llm/
- `router.js`: Loads provider modules, sets them up with API keys/models, and calls the LLM.
- `config.js`: Defines the list of available LLM providers and their default model.
- `secrets.js`: Stores real API keys (excluded from Git).
- `secrets.template.js`: Dummy template users copy and fill in.
- `openrouter/provider.js`: Connects to OpenRouter API, defines `setup()` and `llmCall()`.

### ui/
- Currently unused, but intended for:
  - Moving UI logic out of `content.js` (e.g. `overlay.js`)
  - Styling via `popup.css`
  - Popup extension page (`popup.html`)

### utils/
- `messaging.js`: Intended to abstract `chrome.runtime.sendMessage`/`chrome.tabs.sendMessage` for later use. Not yet wired in.

---

## Design Notes

- UI is not yet separated — `content.js` handles DOM injection and styling directly
- LLM logic is modular and swap-ready via `router.js` and `config.js`
- Commands and context menus both flow through the same handler function
- Future UI separation can make use of `ui/overlay.js` and `popup.css` for maintainable styling

---

## 🚀 Adding a New Command

To add a new command (e.g. "critique"):
1. Add it to `commands.js` → `commandMap`
2. Add it to `manifest.json` → `commands`
3. (Optional) Add it to `background.js` → context menu items

No other files need changes.

---

## 🔐 Git Hygiene

- `llm/secrets.js` should be in `.gitignore`
- `secrets.template.js` can be committed to show structure

---

               ┌────────────┐
               │ User input │
               └────┬───────┘
                    │
        ┌───────────▼─────────────┐
        │ context menu / shortcut │
        └───────────┬─────────────┘
                    │
             background.js
                    │
                    ▼
             commands.js
        (decides instruction + gets text)
                    │
                    ▼
          content.js → window.getSelection()
                    │
                    ▼
             llm/router.js
                    │
                    ▼
      llm/openrouter/provider.js
                    │
                    ▼
         ← AI model response →
                    │
             commands.js
                    ▼
          content.js → showResult()
                    ▼
        Floating result box on screen
