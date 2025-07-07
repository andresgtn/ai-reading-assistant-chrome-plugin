// 📄 view.js — Floating UI overlay for LLM results — draggable, resizable (custom logic), scrollable.

// Remove existing overlay
function removeOverlay() {
  const el = document.getElementById("ai-reading-overlay");
  if (el) el.remove();
}

// Show loading overlay
function showLoadingOverlay() {
  removeOverlay();

  const overlay = document.createElement("div");
  overlay.id = "ai-reading-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#fff",
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "8px",
    fontFamily: "sans-serif",
    fontStyle: "italic",
    fontSize: "14px",
    opacity: 0.8,
    zIndex: 9999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    pointerEvents: "none"
  });

  overlay.innerText = "Loading AI response...";
  document.body.appendChild(overlay);
}

// Render final overlay with LLM result
function createOverlay(rawText) {
  removeOverlay();
  const resultText = cleanText(rawText);

  const overlay = document.createElement("div");
  overlay.id = "ai-reading-overlay";
  Object.assign(overlay.style, baseOverlayStyle());

  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";

  const dragHandle = document.createElement("div");
  Object.assign(dragHandle.style, {
    height: "10px",
    cursor: "move",
    margin: "-12px -12px 8px -12px",
    background: "transparent"
  });
  makeDraggable(overlay, dragHandle);
  overlay.appendChild(dragHandle);

  const content = document.createElement("div");
  content.className = "ai-overlay-text";
  content.innerText = resultText || "No response.";
  Object.assign(content.style, contentStyle());
  overlay.appendChild(content);

  const buttonRow = document.createElement("div");
  Object.assign(buttonRow.style, {
    marginTop: "auto",
    display: "flex",
    gap: "8px"
  });

  const copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy";
  Object.assign(copyBtn.style, buttonStyle());
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(resultText).then(() => {
      copyBtn.innerText = "Copied!";
      setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
    });
  };
  buttonRow.appendChild(copyBtn);

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  Object.assign(closeBtn.style, buttonStyle());
  closeBtn.onclick = () => removeOverlay();
  buttonRow.appendChild(closeBtn);

  overlay.appendChild(buttonRow);
  makeCustomResizable(overlay);
  document.body.appendChild(overlay);
}

function baseOverlayStyle() {
  return {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#fff",
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "8px",
    minWidth: "200px",
    minHeight: "100px",
    width: "320px",
    height: "auto",
    fontFamily: "sans-serif",
    zIndex: 9999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    overflow: "hidden"
  };
}

function contentStyle() {
  return {
    flexGrow: 1,
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
    fontSize: "14px",
    marginBottom: "8px"
  };
}

function buttonStyle() {
  return {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "13px"
  };
}

function cleanText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^- /gm, "• ")
    .replace(/^\s*\n/gm, "")
    .trim();
}

function makeDraggable(el, handle) {
  let startX = 0, startY = 0, offsetX = 0, offsetY = 0;

  handle.onmousedown = function (e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    document.onmousemove = onMouseMove;
    document.onmouseup = stopDrag;
  };

  function onMouseMove(e) {
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    let newTop = el.offsetTop + offsetY;
    let newLeft = el.offsetLeft + offsetX;

    newTop = Math.max(0, Math.min(window.innerHeight - 50, newTop));
    newLeft = Math.max(0, Math.min(window.innerWidth - 50, newLeft));

    el.style.top = newTop + "px";
    el.style.left = newLeft + "px";
  }

  function stopDrag() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

// ✅ Only this function changed
function makeCustomResizable(el) {
  const resizer = document.createElement("div");
  Object.assign(resizer.style, {
    width: "16px",
    height: "16px",
    position: "absolute",
    right: "2px",
    bottom: "2px",
    cursor: "nwse-resize",
    zIndex: 10000
  });
  el.appendChild(resizer);

  let startX, startY, startWidth, startHeight;

  resizer.addEventListener("mousedown", function (e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(getComputedStyle(el).width, 10);
    startHeight = parseInt(getComputedStyle(el).height, 10);
    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  });

  function doResize(e) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const maxWidth = window.innerWidth - el.offsetLeft - 10;
    const maxHeight = window.innerHeight - el.offsetTop - 10;

    const newWidth = Math.min(Math.max(200, startWidth + deltaX), maxWidth);
    const newHeight = Math.min(Math.max(100, startHeight + deltaY), maxHeight);

    el.style.width = newWidth + "px";
    el.style.height = newHeight + "px";
  }

  function stopResize() {
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  }
}

// Export
window.createOverlay = createOverlay;
window.showLoadingOverlay = showLoadingOverlay;