const HXAGENT_OVERLAY_ATTR = "data-hxagent-overlay";

function clearClickableOverlays() {
  document.querySelectorAll(`[${HXAGENT_OVERLAY_ATTR}]`).forEach(el => el.remove());
}

function visualizeClickable(clickables) {
  clearClickableOverlays();

  const resolveXPath = (xpath) => {
    try {
      return document.evaluate(
        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;
    } catch (e) {
      return null;
    }
  };


  let container = document.createElement("div");
  container.setAttribute(HXAGENT_OVERLAY_ATTR, "container");
  Object.assign(container.style, {
    position:      "fixed",
    top:           "0",
    left:          "0",
    width:         "0",
    height:        "0",
    pointerEvents: "none",
    zIndex:        "2147483647",   // max z-index
    overflow:      "visible",
  });
  document.documentElement.appendChild(container);

  clickables.forEach((item, index) => {
    const node = resolveXPath(item.xpath);
    if (!node) return;

    const rect = node.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    // ── Border box ──────────────────────────────────────────────────────────
    const box = document.createElement("div");
    box.setAttribute(HXAGENT_OVERLAY_ATTR, "box");
    Object.assign(box.style, {
      position:     "fixed",
      top:          rect.top  + "px",
      left:         rect.left + "px",
      width:        rect.width  + "px",
      height:       rect.height + "px",
      boxSizing:    "border-box",
      border:       "2px solid #E8494A",
      borderRadius: "3px",
      pointerEvents:"none",
      background:   "rgba(232,73,74,0.06)",
    });
    container.appendChild(box);

    const label = document.createElement("div");
    label.setAttribute(HXAGENT_OVERLAY_ATTR, "label");
    label.textContent = index;        // 0-based numbering to match result index
    Object.assign(label.style, {
      position:      "fixed",
      top:           (rect.top - 7) + "px",
      left:          (rect.right - 2) + "px",
      background:    "none",
      color:         "#E8494A",
      fontSize:      "9px",
      fontFamily:    "monospace, sans-serif",
      fontWeight:    "bold",
      lineHeight:    "1",
      pointerEvents: "none",
      whiteSpace:    "nowrap",
      textShadow:    "0 0 2px #fff, 0 0 2px #fff",
      zIndex:        "2147483647",
    });
    container.appendChild(label);
  });

  console.log(`[HXAgent] Visualized ${clickables.length} clickable elements.`);
  return clickables;
}


window.addEventListener("scroll",  () => { if (document.querySelector(`[${HXAGENT_OVERLAY_ATTR}]`)) visualizeClickable(getJSON()); }, { passive: true });
window.addEventListener("resize",  () => { if (document.querySelector(`[${HXAGENT_OVERLAY_ATTR}]`)) visualizeClickable(getJSON()); }, { passive: true });

visualizeClickable(getJSON());