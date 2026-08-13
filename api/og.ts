function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const name = (url.searchParams.get("n") ?? "you").slice(0, 48);
  const safe = escapeXml(name);
  const hue = hashString(slugify(name)) % 40;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1b1410"/>
  <rect x="48" y="48" width="1104" height="534" fill="#efe2cc" stroke="#c45c26" stroke-width="10"/>
  <text x="90" y="140" font-family="Georgia, serif" font-size="28" fill="#c45c26" letter-spacing="6">FT-013  ELSEWHO</text>
  <text x="90" y="280" font-family="Georgia, serif" font-size="72" fill="#1b1410">${safe}</text>
  <text x="90" y="360" font-family="Georgia, serif" font-size="36" font-style="italic" fill="#5c4030">six other lives, printed</text>
  <text x="90" y="520" font-family="ui-monospace, monospace" font-size="22" fill="#8a7460">LinkedIn · villain · dating · peasant · obituary · startup</text>
  <circle cx="1020" cy="180" r="48" fill="#c45c26" opacity="${0.4 + (hue % 10) / 20}"/>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
