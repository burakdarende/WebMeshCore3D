// ═══════════════════════════════════════════════════════════════════════════════
// CURSOR UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
// Create small custom cursors using Canvas

export function createSmallCursor(
  type = "default",
  size = 16,
  color = "#ffffff"
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);

  if (type === "default") {
    // Simple crosshair cursor
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Vertical line
    ctx.moveTo(size / 2, 2);
    ctx.lineTo(size / 2, size - 2);
    // Horizontal line
    ctx.moveTo(2, size / 2);
    ctx.lineTo(size - 2, size / 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 1, 0, 2 * Math.PI);
    ctx.fill();
  } else if (type === "pointer") {
    // Simple pointer arrow
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(2, size - 4);
    ctx.lineTo(6, size - 8);
    ctx.lineTo(10, size - 4);
    ctx.lineTo(8, size - 6);
    ctx.lineTo(size - 4, size - 2);
    ctx.lineTo(size - 2, size - 4);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Convert canvas to data URL
  const dataURL = canvas.toDataURL("image/png");
  return dataURL;
}

export function applyCursor(element, type = "default", size = 16) {
  const cursorDataURL = createSmallCursor(type, size);
  const hotspot = Math.floor(size / 2);
  element.style.cursor = `url(${cursorDataURL}) ${hotspot} ${hotspot}, ${
    type === "pointer" ? "pointer" : "crosshair"
  }`;
}

// Initialize cursors when DOM is ready
export function initCustomCursors() {
  const defaultCursor = createSmallCursor("default", 16, "#ffffff");
  const pointerCursor = createSmallCursor("pointer", 16, "#ffffff");

  // Apply to body
  document.body.style.cursor = `url(${defaultCursor}) 8 8, crosshair`;

  // Store cursors globally for easy access
  window.customCursors = {
    default: `url(${defaultCursor}) 8 8, crosshair`,
    pointer: `url(${pointerCursor}) 8 8, pointer`,
  };
}
