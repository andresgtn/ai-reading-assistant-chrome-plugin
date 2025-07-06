/**
 * 🎛️ Commands Module
 * Handles both keyboard shortcuts and right-click context menu actions.
 * Maps command names to instructions and executes them via llmCall(text, instruction).
 */

import { llmCall } from "../llm/router.js";

// 🧠 Command-to-instruction mapping
const commandMap = {
  summarize: "Summarize this text into a few concise bullet points.",
  paraphrase: "Paraphrase the following text for clarity.",
  explain: "Explain this text in simple terms.",
  translate: "Translate this to Spanish." // TODO: support other languages
};

/**
 * Shared handler for both keyboard + context menu commands.
 * @param {string} command - must match a key in commandMap
 * @param {object} [tab] - Chrome tab object (optional if triggered via keyboard)
 */
export async function handleCommand(command, tab = null) {
  const instruction = commandMap[command];
  if (!instruction) return;

  if (!tab) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = tabs[0];
  }

  chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, async (res) => {
    if (!res?.text) return;

    const result = await llmCall(res.text, instruction);

    chrome.tabs.sendMessage(tab.id, {
      action: "showResult",
      result
    });
  });
}

// 🎯 Listen for keyboard shortcuts (defined in manifest.json)
chrome.commands.onCommand.addListener((command) => {
  handleCommand(command);
});
