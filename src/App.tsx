import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { downloadPng, paintCard } from "./canvas";
import { generateDeck, type Universe } from "./copy";
import { displayName, readQuery, slugify } from "./seed";

export default function App() {
  const initial = readQuery();
  const [name, setName] = useState(initial.name);
  const [handle, setHandle] = useState(initial.handle);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [active, setActive] = useState<Universe>("linkedin");
  const [status, setStatus] = useState("");

  const deck = useMemo(() => {
    if (!name.trim()) return [];
    return generateDeck(name, handle);
  }, [name, handle]);

  const card = deck.find((c) => c.id === active) ?? deck[0];

  useEffect(() => {
    const onPop = () => {
      const q = readQuery();
      setName(q.name);
      setHandle(q.handle);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!name.trim()) {
      document.title = "Elsewho";
      return;
    }
    document.title = `Elsewho — ${displayName(name)}`;
    const url = new URL(window.location.href);
    url.searchParams.set("n", name.trim());
    if (handle.trim()) url.searchParams.set("h", handle.replace(/^@/, ""));
    else url.searchParams.delete("h");
    window.history.replaceState({}, "", url);
  }, [name, handle]);

  const onPhoto = (file: File | undefined) => {
    if (!file) {
      setPhoto(null);
      return;
    }
    const img = new Image();
    img.onload = () => setPhoto(img);
    img.src = URL.createObjectURL(file);
  };

  const shareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => setStatus("link copied"));
  };

  const save = async () => {
    if (!card) return;
    const canvas = await paintCard(card, photo);
    downloadPng(canvas, `elsewho-${card.id}-${slugify(name)}.png`);
    setStatus("png saved");
  };

  const copyCaption = () => {
    if (!card) return;
    navigator.clipboard.writeText(`${card.caption} ${window.location.href}`).then(
      () => setStatus("caption copied"),
    );
  };

  return (
    <>
      <header className="mast">
        <p className="acc">FT–013</p>
        <h1>Elsewho</h1>
        <p className="lede">
          Paste a name. Optional handle. Optional face. Receive six print-process
          cards from universes that almost hired you, dated you, taxed you, or
          incorporated you.
        </p>
      </header>

      <form
        className="intake"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setName(String(fd.get("name") ?? ""));
          setHandle(String(fd.get("handle") ?? ""));
          setActive("linkedin");
        }}
      >
        <label>
          Name
          <input
            name="name"
            defaultValue={name}
            placeholder="Ada Lovelace"
            autoComplete="nickname"
            required
            maxLength={64}
          />
        </label>
        <label>
          X handle
          <input
            name="handle"
            defaultValue={handle}
            placeholder="optional"
            maxLength={32}
          />
        </label>
        <label className="photo">
          Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPhoto(e.target.files?.[0])}
          />
        </label>
        <button type="submit">Print the other lives</button>
      </form>

      {card ? (
        <section className="studio">
          <nav className="tabs" aria-label="Universes">
            {deck.map((c) => (
              <button
                key={c.id}
                type="button"
                className={c.id === card.id ? "on" : ""}
                onClick={() => setActive(c.id)}
              >
                {c.label}
              </button>
            ))}
          </nav>
          <article
            className={`plate plate-${card.id}`}
            style={
              {
                "--paper": card.print.paper,
                "--ink": card.print.ink,
                "--rule": card.print.rule,
                "--stamp": card.print.stamp,
              } as CSSProperties
            }
          >
            <p className="kicker">{card.kicker}</p>
            <h2>{card.title}</h2>
            {photo ? (
              <img
                className="face"
                src={photo.src}
                alt=""
                data-print={card.id}
              />
            ) : null}
            <pre className="body">{card.body}</pre>
            <p className="foot">{card.footer}</p>
          </article>
          <div className="acts">
            <button type="button" onClick={save}>
              Save PNG
            </button>
            <button type="button" className="ghost" onClick={copyCaption}>
              Copy caption
            </button>
            <button type="button" className="ghost" onClick={shareUrl}>
              Copy link
            </button>
            {status ? <span className="status">{status}</span> : null}
          </div>
          <p className="privacy">
            The photo never leaves this browser. Same name, same cards — the
            copy is combinatorial, not a model, unless you later add a key.
          </p>
        </section>
      ) : (
        <section className="empty">
          <p>Try “Ada”, your group-chat nickname, or a coworker you are allowed to roast.</p>
        </section>
      )}

      <footer className="webring">
        <a href="https://fun-toys-alpha.vercel.app">a Fun Toy</a>
        <span className="dot">·</span>
        <a href="https://the-elsewhere.vercel.app">prev</a>
        <a href="https://jigmoji.vercel.app">next</a>
      </footer>
    </>
  );
}

