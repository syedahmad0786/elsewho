export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rngFrom(input: string): () => number {
  let a = hashString(input) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(rng: () => number, modulo: number): number {
  if (modulo <= 0) return 0;
  return Math.floor(rng() * modulo);
}

export function pickOne<T>(rng: () => number, items: readonly T[]): T {
  return items[pickIndex(rng, items.length)] as T;
}

export function slugify(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/['’@]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function displayName(raw: string): string {
  const cleaned = raw.replace(/^@+/, "").trim().slice(0, 64);
  if (!cleaned) return "Anonymous";
  return cleaned
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export function readQuery(): { name: string; handle: string } {
  const q = new URLSearchParams(window.location.search);
  return {
    name: (q.get("n") ?? "").slice(0, 64),
    handle: (q.get("h") ?? "").replace(/^@/, "").slice(0, 32),
  };
}
