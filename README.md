# AI Reading Assistant – Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and send it to an LLM for summarizing, paraphrasing, explaining, or translating via OpenRouter.

---

## Features

- Highlight text and trigger AI actions using the right-click context menu or keyboard shortcuts
- Supported actions:
  - Summarize
  - Paraphrase
  - Explain
  - Translate (to Spanish)
- LLM responses are displayed in a floating box injected into the page
- Commands are configurable via the manifest and routed through a modular provider system (currently OpenRouter)

---

## Architecture

- **UI is currently handled directly in `content/content.js`**
  - A result box is created using `document.createElement`
  - Styles are applied inline via JavaScript
- The `ui/` folder exists but is not yet used
- The LLM provider logic is modular, configured in `llm/`
- The `background/` folder registers context menus and shortcuts and forwards commands
- The `commands.js` module maps actions to instructions and calls the LLM
- The `llm/router.js` file routes to the correct provider (OpenRouter)
- Provider setup uses `llm/secrets.js` and `llm/config.js` to handle keys and defaults

---

## Local Setup

### 1. Clone the project

```bash
git clone https://github.com/YOUR-USERNAME/gpt-reader-assistant.git
cd gpt-reader-assistant
```

### 2. Add your API key

```bash
cp llm/secrets.template.js llm/secrets.js
```

Then paste your OpenRouter API key into `llm/secrets.js`.

---

## Load the Extension in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **"Load unpacked"**
4. Select the `gpt-reader-assistant/` folder

---

## Keyboard Shortcuts

Change shortcuts under `chrome://extensions/shortcuts`.

| Command     | Shortcut          |
|-------------|-------------------|
| Summarize   | Ctrl+Shift+X      |
| Paraphrase  | Ctrl+Shift+P      |
| Explain     | Ctrl+E / Cmd+E    |
| Translate   | Ctrl+Shift+T      |

Replace ctrl with cmd for Mac. See or change shortcuts in manifest.json

---

## Notes

- UI separation is planned but not yet implemented. All rendering is currently in `content.js`.
- The `ui/` folder and `utils/messaging.js` exist but are not wired into the current runtime.

---

## Privacy

- No user data is collected or tracked.
- All requests are made locally using your OpenRouter API key.
