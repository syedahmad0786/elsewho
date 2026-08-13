import type { Card } from "./copy";

const W = 1080;
const H = 1350;

function wrap(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  lh: number,
): number {
  const paragraphs = text.split("\n");
  let cy = y;
  for (const p of paragraphs) {
    if (!p) {
      cy += lh * 0.55;
      continue;
    }
    const words = p.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (g.measureText(test).width > max) {
        g.fillText(line, x, cy);
        line = w;
        cy += lh;
      } else line = test;
    }
    if (line) {
      g.fillText(line, x, cy);
      cy += lh;
    }
  }
  return cy;
}

function grain(g: CanvasRenderingContext2D, amount: number): void {
  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount * 255;
    d[i] = clamp(d[i]! + n);
    d[i + 1] = clamp(d[i + 1]! + n);
    d[i + 2] = clamp(d[i + 2]! + n);
  }
  g.putImageData(img, 0, 0);
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, n));
}

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export async function paintCard(
  card: Card,
  photo: HTMLImageElement | null,
): Promise<HTMLCanvasElement> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) throw new Error("canvas");
  const { print } = card;

  g.fillStyle = print.paper;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = print.rule;
  g.lineWidth = card.id === "obituary" ? 3 : 8;
  g.strokeRect(42, 42, W - 84, H - 84);

  if (card.id === "villain") {
    g.fillStyle = print.rule;
    g.fillRect(42, 42, W - 84, 18);
  }
  if (card.id === "peasant") {
    g.strokeStyle = print.stamp;
    g.lineWidth = 2;
    for (let y = 120; y < H - 80; y += 64) {
      g.beginPath();
      g.moveTo(70, y);
      g.lineTo(W - 70, y);
      g.stroke();
    }
  }
  if (card.id === "startup") {
    const grd = g.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, "#1a1440");
    grd.addColorStop(1, print.paper);
    g.fillStyle = grd;
    g.fillRect(42, 42, W - 84, H - 84);
  }

  g.fillStyle = print.stamp;
  g.font = "600 28px 'IBM Plex Mono', ui-monospace, monospace";
  g.fillText(card.kicker, 90, 130);

  if (photo) {
    const size = 220;
    const x = W - 90 - size;
    const y = 160;
    g.save();
    if (card.id === "linkedin" || card.id === "dating") {
      g.beginPath();
      g.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      g.clip();
    } else {
      roundRect(g, x, y, size, size, card.id === "peasant" ? 8 : 4);
      g.clip();
    }
    if (card.id === "peasant") g.filter = "sepia(0.85) contrast(1.05)";
    if (card.id === "villain") g.filter = "grayscale(0.7) contrast(1.2)";
    if (card.id === "obituary") g.filter = "grayscale(1) contrast(1.05)";
    if (card.id === "startup") g.filter = "saturate(0.6) contrast(1.1)";
    if (card.id === "dungeon") g.filter = "sepia(0.4) contrast(1.15) hue-rotate(40deg)";
    if (card.id === "horoscope") g.filter = "contrast(1.2) saturate(1.4) hue-rotate(-20deg)";
    drawCover(g, photo, x, y, size, size);
    g.restore();
    g.strokeStyle = print.rule;
    g.lineWidth = 3;
    if (card.id === "linkedin" || card.id === "dating") {
      g.beginPath();
      g.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      g.stroke();
    } else {
      roundRect(g, x, y, size, size, 4);
      g.stroke();
    }
  }

  const titleFont =
    print.font === "mono"
      ? "600 64px 'IBM Plex Mono', monospace"
      : print.font === "sans"
        ? "700 68px 'Figtree', system-ui, sans-serif"
        : "600 70px 'Fraunces', Georgia, serif";
  g.fillStyle = print.ink;
  g.font = titleFont;
  const afterTitle = wrap(g, card.title, 90, 230, photo ? 680 : 900, 78);

  g.font =
    print.font === "sans"
      ? "500 36px 'Figtree', system-ui, sans-serif"
      : "italic 36px 'Fraunces', Georgia, serif";
  wrap(g, card.body, 90, afterTitle + 36, 900, 48);

  g.fillStyle = print.stamp;
  g.font = "500 24px 'IBM Plex Mono', ui-monospace, monospace";
  g.fillText(card.footer, 90, H - 110);
  g.fillText("ELSEWHO  ·  a Fun Toy", 90, H - 72);

  grain(g, print.grain);
  return c;
}

function drawCover(
  g: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const ir = img.width / img.height;
  const r = w / h;
  let dw = w;
  let dh = h;
  let dx = x;
  let dy = y;
  if (ir > r) {
    dw = h * ir;
    dx = x - (dw - w) / 2;
  } else {
    dh = w / ir;
    dy = y - (dh - h) / 2;
  }
  g.drawImage(img, dx, dy, dw, dh);
}

export function downloadPng(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
}
