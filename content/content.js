/**
 * 📄 content.js
 *
 * This content script runs in the context of every webpage the user visits.
 * It handles two key responsibilities for the AI Assistant:
 *
 * 1. "getSelectedText"
 *    - Called by: commands.js
 *    - Responds with the currently highlighted text on the page.
 *
 * 2. "showResult"
 *    - Called by: commands.js
 *    - Injects a floating result box into the page DOM to display the LLM response.
 *
 * It acts as a bridge between the background logic and the actual webpage content.
 */


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSelectedText") {
    const selectedText = window.getSelection().toString();
    sendResponse({ text: selectedText });
    return true; // ensures async sendResponse is respected
  }

  if (message.action === "showResult") {
    showFloatingResult(message.result);
    // return true; //Removed DEBUG
  }
});

/**
 * Injects a floating box with the AI result on the page.
 * @param {string} result - LLM-generated response text
 */
function showFloatingResult(result) {
  // Remove existing result box if present
  const existing = document.getElementById("ai-reader-assistant-result");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "ai-reader-assistant-result";
  container.innerText = result;

  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    maxWidth: "400px",
    padding: "12px 16px",
    backgroundColor: "#1a1a1a",
    color: "#f8f8f8",
    fontSize: "14px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 999999,
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
  });

  // Close on click
  container.addEventListener("click", () => container.remove());

  document.body.appendChild(container);
}
