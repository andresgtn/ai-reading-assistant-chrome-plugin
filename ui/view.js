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
 * @param {string} rawText - The text to display inside the overlay
 */
function createOverlay(rawText) {
  removeOverlay();

  const resultText = cleanText(rawText);

  const overlay = document.createElement("div");
  overlay.id = "ai-reading-overlay";
  Object.assign(overlay.style, baseOverlayStyle());
  makeDraggable(overlay);
  makeResizable(overlay);

  // Create scrollable text area
  const content = document.createElement("div");
  content.className = "ai-overlay-text";
  content.innerText = resultText || "No response.";
  Object.assign(content.style, contentStyle());
  overlay.appendChild(content);

  // Add action buttons (Copy + Close)
  const buttonRow = document.createElement("div");

  const copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy";
  Object.assign(copyBtn.style, buttonStyle());
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(resultText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  };
  buttonRow.appendChild(copyBtn);

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  Object.assign(closeBtn.style, buttonStyle());
  closeBtn.onclick = () => removeOverlay();
  buttonRow.appendChild(closeBtn);

  overlay.appendChild(buttonRow);
  document.body.appendChild(overlay);
}

/**
 * Style for the main overlay container.
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
    resize: "both",
    overflow: "auto",
    cursor: "move"
  };
}

/**
 * Style for the text content area.
 */
function contentStyle() {
  return {
    marginBottom: "12px",
    maxHeight: "200px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: "1.5"
  };
}

/**
 * Style for overlay buttons.
 */
function buttonStyle() {
  return {
    marginRight: "8px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  };
}

/**
 * Removes common Markdown formatting from LLM response.
 * Currently handles:
 * - **bold**
 * - `-` bullets → •
 * - Excess empty lines
 */
function cleanText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // Remove bold markdown
    .replace(/^- /gm, "• ")            // Dash bullets → dot bullets
    .replace(/^\s*\n/gm, "")           // Remove empty lines
    .trim();
}

/**
 * Makes the overlay draggable by mouse (click + move).
 */
function makeDraggable(el) {
  let pos = { x: 0, y: 0, dx: 0, dy: 0 };

  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos.dx = e.clientX;
    pos.dy = e.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = doDrag;
  }

  function doDrag(e) {
    e.preventDefault();
    pos.x = pos.dx - e.clientX;
    pos.y = pos.dy - e.clientY;
    pos.dx = e.clientX;
    pos.dy = e.clientY;

    el.style.top = (el.offsetTop - pos.y) + "px";
    el.style.left = (el.offsetLeft - pos.x) + "px";
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/**
 * Makes the overlay resizable using native browser handles.
 */
function makeResizable(el) {
  el.style.resize = "both";
  el.style.overflow = "auto";
}

/**
 * Expose functions globally for content script access.
 */
window.createOverlay = createOverlay;
window.showLoadingOverlay = showLoadingOverlay;
