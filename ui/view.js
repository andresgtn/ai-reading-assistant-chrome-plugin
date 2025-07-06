/**
 * 📄 view.js
 *
 * Handles UI rendering for the AI Reading Assistant.
 * Provides overlay for displaying LLM responses and a loading state.
 * This file is loaded globally (not as a module) and used by content scripts.
 */

/**
 * Removes existing overlay from the page, if any.
 */
function removeOverlay() {
  const existing = document.getElementById("ai-reading-overlay");
  if (existing) existing.remove();
}

/**
 * Shows a simple loading indicator overlay.
 */
function showLoadingOverlay() {
  removeOverlay();

  const overlay = document.createElement("div");
  overlay.id = "ai-reading-overlay";
  overlay.innerText = "Loading AI response...";
  Object.assign(overlay.style, baseOverlayStyle());

  overlay.style.fontStyle = "italic";
  overlay.style.opacity = "0.8";

  document.body.appendChild(overlay);
}

/**
 * Renders the AI response in a floating overlay on the webpage.
 * Replaces any previous overlay (including loading state) with the final result.
 *
 * @param {string} resultText - The text to display inside the overlay
 */
function createOverlay(resultText) {
  // Remove any existing overlay (either loading or previous result)
  removeOverlay();

  // Create the main overlay container
  const overlay = document.createElement("div");
  overlay.id = "ai-reading-overlay";
  Object.assign(overlay.style, baseOverlayStyle());

  // Create a scrollable div to hold the AI-generated text
  const content = document.createElement("div");
  content.className = "ai-overlay-text";
  content.innerText = resultText || "No response.";
  Object.assign(content.style, {
    marginBottom: "12px",
    maxHeight: "200px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  });
  overlay.appendChild(content);

  // Define action buttons (e.g., Copy, Close)
  const actions = [
    {
      label: "Copy",
      onClick: () => navigator.clipboard.writeText(resultText),
    },
    {
      label: "Close",
      onClick: () => removeOverlay(),
    }
  ];

  // Add buttons to the overlay
  actions.forEach(action => {
    const btn = document.createElement("button");
    btn.innerText = action.label;
    btn.onclick = action.onClick;
    Object.assign(btn.style, {
      marginRight: "8px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      background: "#007bff",
      color: "white",
      cursor: "pointer",
      fontSize: "13px",
    });
    overlay.appendChild(btn);
  });

  // Add the overlay to the page
  document.body.appendChild(overlay);
}

/**
 * Base shared style for overlay container.
 */
function baseOverlayStyle() {
  return {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#ffffff",
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "8px",
    maxWidth: "320px",
    fontFamily: "sans-serif",
    zIndex: 9999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  };
}
