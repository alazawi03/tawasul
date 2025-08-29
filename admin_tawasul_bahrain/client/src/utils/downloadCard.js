// src/utils/downloadCard.js
import html2canvas from "html2canvas";

/**
 * Capture a DOM node and download as PNG (clones the node off-screen so the
 * original on the page never reflows/changes).
 *
 * @param {HTMLElement} node
 * @param {{filename?:string, scale?:number, forceSize?:number|false}} opts
 */
export async function downloadNodeAsPNG(
  node,
  { filename = "card.png", scale = 2, forceSize = 1080 } = {}
) {
  if (!node) throw new Error("No node to capture");

  // Make sure webfonts are ready (prevents layout jumps in the clone)
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch (e) { }
  }

  // Clone the node and render it off-screen
  const rect = node.getBoundingClientRect();
  const clone = node.cloneNode(true);

  // Freeze any animations/transitions in the clone
  clone.style.animation = "none";
  clone.style.transition = "none";

  // Force square size for export (or keep current size)
  const w = forceSize || Math.ceil(rect.width);
  const h = forceSize || Math.ceil(rect.height);

  Object.assign(clone.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${w}px`,
    height: `${h}px`,
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
    transform: "none",
  });

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      backgroundColor: null,
      windowWidth: w,
      windowHeight: h,
      // Ensure we snapshot the clone, not the original
      // (html2canvas will use the current DOM by default)
      removeContainer: true,
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } finally {
    document.body.removeChild(clone);
  }
}
