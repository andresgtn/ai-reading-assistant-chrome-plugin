/**
 * 📄 content.js
 *
 * This content script runs inside the webpage context.
 * It listens for messages from the background script and:
 *
 * 1. Responds with the currently selected text on the page.
 * 2. Renders the AI-generated result (summary, translation, explanation, etc.)
 *    using a floating UI overlay.
 */


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Action: get currently selected text on the page
  if (message.action === "getSelectedText") {
    const selectedText = window.getSelection().toString();
    sendResponse({ text: selectedText });
    return true; // keeps the message channel open for async responses
  }
  
  // Action: show loading wheel while LLM processes response
  if (message.action === "showLoading") {
      showLoadingOverlay();
    }

  // Action: display the AI result in a floating overlay
  if (message.action === "showResult") {
    createOverlay(message.result);
  }

});
