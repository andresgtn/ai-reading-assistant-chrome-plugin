import { handleCommand } from './commands.js';

/**
 * 💡 Context Menu Setup
 * Creates one item for each available AI action (summarize, explain, etc.)
 * These IDs must match the keys in `commands.js` → commandMap.
 */
const actions = {
  summarize: "Summarize with AI",
  paraphrase: "Paraphrase with AI",
  explain: "Explain with AI",
  translate: "Translate with AI"
};

chrome.runtime.onInstalled.addListener(() => {
  Object.entries(actions).forEach(([id, title]) => {
    chrome.contextMenus.create({
      id,
      title,
      contexts: ["selection"]
    });
  });
});

/**
 * When a context menu item is clicked, call the shared command handler
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleCommand(info.menuItemId, tab); // e.g. "summarize"
});
