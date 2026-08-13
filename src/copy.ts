import { displayName, pickOne, rngFrom, slugify } from "./seed";

export type Universe =
  | "linkedin"
  | "villain"
  | "dating"
  | "peasant"
  | "obituary"
  | "startup"
  | "dungeon"
  | "horoscope";

export type Card = {
  id: Universe;
  label: string;
  kicker: string;
  title: string;
  body: string;
  footer: string;
  caption: string;
  print: Print;
};

export type Print = {
  paper: string;
  ink: string;
  rule: string;
  stamp: string;
  grain: number;
  font: "serif" | "sans" | "mono";
};

const UNIVERSES: Universe[] = [
  "linkedin",
  "villain",
  "dating",
  "peasant",
  "obituary",
  "startup",
  "dungeon",
  "horoscope",
];

const PRINT: Record<Universe, Print> = {
  linkedin: {
    paper: "#f4f7fb",
    ink: "#0b2540",
    rule: "#0a66c2",
    stamp: "#7a8aa0",
    grain: 0.04,
    font: "sans",
  },
  villain: {
    paper: "#140b0d",
    ink: "#f3d7c4",
    rule: "#c1121f",
    stamp: "#8a3a3a",
    grain: 0.12,
    font: "serif",
  },
  dating: {
    paper: "#fff0f4",
    ink: "#4a1530",
    rule: "#e11d74",
    stamp: "#c48aa0",
    grain: 0.06,
    font: "serif",
  },
  peasant: {
    paper: "#e8d5a8",
    ink: "#3b2410",
    rule: "#7a5429",
    stamp: "#5c3d1e",
    grain: 0.18,
    font: "serif",
  },
  obituary: {
    paper: "#f3ecd8",
    ink: "#1c1a16",
    rule: "#1c1a16",
    stamp: "#6b6458",
    grain: 0.1,
    font: "serif",
  },
  startup: {
    paper: "#0f1020",
    ink: "#f5f2ff",
    rule: "#a78bfa",
    stamp: "#7c6ab0",
    grain: 0.05,
    font: "sans",
  },
  dungeon: {
    paper: "#1c2418",
    ink: "#e8f0c8",
    rule: "#c4a574",
    stamp: "#8a9a62",
    grain: 0.16,
    font: "mono",
  },
  horoscope: {
    paper: "#2a0830",
    ink: "#ffe6a8",
    rule: "#ff4fd8",
    stamp: "#c9a0ff",
    grain: 0.08,
    font: "serif",
  },
};

const ROLES = [
  "Staff Emotional Plumber",
  "Principal Vibe Architect",
  "Head of Unfinished Tabs",
  "Director of Soft Launches",
  "Chief Apology Officer",
  "Staff Engineer of Looking Busy",
  "VP, Adjacent Possibilities",
  "Intern to the Concept of Tuesday",
  "Distinguished Slack Presence",
  "Manager of Things That Almost Shipped",
];

const HEADLINES = [
  "I turn ambiguity into a calendar invite.",
  "I have 10+ years of surviving group chats.",
  "I specialize in the part after the brainstorm.",
  "I make rooms quieter and decks shorter.",
  "I ship the version that does not need a sequel.",
  "I am fluent in three dashboards and one honest sentence.",
];

const ABOUT = [
  "Previously: a person who answered email like it was a calling. Currently: a person who answers email like it is weather.",
  "Open to roles that involve a window, a plant that is not dead, and fewer than four weekly standups named after animals.",
  "I once wrote a strategy doc that was just a grocery list. It still outperforms last quarter.",
  "Passionate about mentorship, which is my word for forwarding the useful link.",
];

const ORIGIN = [
  "It began with a group project in which nobody else opened the doc. The rest was inevitable.",
  "A librarian shushed them in 2009. They have been collecting silence as a weapon ever since.",
  "They were told to share. They shared. The sharing never stopped. The sharing became a throne.",
  "Someone left them on read. Historians call this the First Insult.",
  "They found a forgotten login. Inside: power, a spreadsheet, and a taste for twilight.",
];

const LAIR = [
  "an office kitchen after 7pm",
  "a browser with 86 pinned tabs",
  "the notes app titled 'do not'",
  "a group chat they mute and still rule",
  "the last working booth at the library",
];

const DATING = [
  "Looking for someone who texts back before the bit dies.",
  "Will split the appetizer. Will not split the narrative.",
  "6'2 in certain lighting (museum, golden hour, lies).",
  "My love language is sending the song and then pretending I did not.",
  "Seeking: a co-conspirator for leaving parties at a reasonable hour.",
];

const DATING_PROMPTS = [
  "The key to my heart is",
  "I go feral for",
  "Two truths and a scheduling conflict",
  "My most controversial take",
];

const DATING_ANSWERS = [
  "a playlist with no skips and one embarrassing song left in on purpose.",
  "people who remember the side character's name.",
  "I can parallel park / I cannot parallel park / I will arrive on time.",
  "cereal is a soup and I will die on this spoon.",
  "the last ten minutes of a film when nobody talks.",
];

const PEASANT_JOBS = [
  "keeper of the one good hen",
  "apprentice to a suspicious miller",
  "counter of the lord's geese (unofficial)",
  "mender of boots, breaker of fasts",
  "person who knows which well is haunted",
];

const PEASANT_TITHES = [
  "three eggs, a rumor, and half a song",
  "the good onions, which hurts",
  "a promise to stop naming the pigs",
  "whatever the rain did not take",
];

const OBIT_CAUSES = [
  "a surplus of kindness that finally needed a nap",
  "finishing the book and having nowhere to put the feeling",
  "one last excellent sandwich",
  "walking into a room and being immediately loved, which is exhausting",
];

const OBIT_SURVIVED = [
  "a plant that outlived the lease",
  "several group chats that did not deserve them",
  "the better timeline, which is this one, briefly",
  "a coat with impressive pockets",
];

const STARTUP_NAMES = [
  "Quietly",
  "Afterparty",
  "Second Tab",
  "Mundane AI",
  "Breadcrumb",
  "Soft Launch",
  "Elsewise",
  "Tuesday.app",
];

const STARTUP_PITCHES = [
  "It's Uber, but for the feeling that you left the stove on.",
  "Notion, if Notion had been raised by wolves with taste.",
  "We help teams remember what the meeting was for.",
  "A CRM for people you actually like.",
  "Infrastructure for the apology you workshopped for three days.",
];

const CLASSES = [
  "Bard of Unsent Drafts",
  "Rogue (retired, emotionally)",
  "Cleric of the Group Chat",
  "Paladin of Leaving On Time",
  "Wizard who only knows Prestidigitation and Reply-All",
  "Ranger of the parking garage",
];

const ALIGNMENTS = [
  "Chaotic Soft",
  "Lawful Tired",
  "Neutral with a snack",
  "Good, but only after coffee",
  "True Unbothered",
];

const SIGNS = [
  "the Moon in a group chat",
  "Mercury in 'I'll start Monday'",
  "Venus in the notes app",
  "Mars in the last slice",
  "Saturn in the unread badge",
];

const FORECASTS = [
  "A stranger will compliment your coat. Do not explain the coat.",
  "Avoid people who say synergy. They are not your people, even in this universe.",
  "The 4pm slump is a portal. Walk through it toward a sandwich.",
  "Someone will ask what you do. Answer with a weather report.",
  "Your lucky object is the tab you meant to close in 2019.",
];

export function generateDeck(nameRaw: string, handleRaw: string): Card[] {
  const name = displayName(nameRaw);
  const handle = handleRaw.replace(/^@/, "").trim();
  const seed = `${slugify(name)}|${slugify(handle)}|elsewho`;
  return UNIVERSES.map((id) => oneCard(id, name, handle, seed));
}

function oneCard(
  id: Universe,
  name: string,
  handle: string,
  seed: string,
): Card {
  const rng = rngFrom(`${seed}|${id}`);
  const print = PRINT[id];
  const at = handle ? `@${handle}` : name;

  if (id === "linkedin") {
    const role = pickOne(rng, ROLES);
    const headline = pickOne(rng, HEADLINES);
    const about = pickOne(rng, ABOUT);
    const body = `${headline}\n\n${about}\n\nOpen to work in the sense that I am open to weather.`;
    return {
      id,
      label: "Alternate LinkedIn",
      kicker: "OPEN TO PARALLEL WORK",
      title: `${name}\n${role}`,
      body,
      footer: handle ? `${at} · 500+ timelines` : "500+ timelines",
      caption: `LinkedIn in a kinder universe hired ${name} as ${role}.`,
      print,
    };
  }

  if (id === "villain") {
    const origin = pickOne(rng, ORIGIN);
    const lair = pickOne(rng, LAIR);
    const body = `${origin}\n\nLair: ${lair}.\nMinions: nobody. They do not scale.\nWeakness: being asked “what are you thinking?” in a sincere voice.`;
    return {
      id,
      label: "Villain origin",
      kicker: "CONFIDENTIAL ORIGIN FILE",
      title: `${name}, unfortunately`,
      body,
      footer: "DO NOT LAMINATE · they already won",
      caption: `The villain origin story for ${name} is embarrassingly reasonable.`,
      print,
    };
  }

  if (id === "dating") {
    const hook = pickOne(rng, DATING);
    const prompt = pickOne(rng, DATING_PROMPTS);
    const answer = pickOne(rng, DATING_ANSWERS);
    const body = `${hook}\n\n${prompt}:\n${answer}\n\nDealbreaker: people who say “let’s circle back” on a date.`;
    return {
      id,
      label: "Parallel dating",
      kicker: "THIS UNIVERSE ONLY",
      title: `${name}, 29–∞`,
      body,
      footer: handle ? `${at} · 12 km away (emotionally)` : "12 km away (emotionally)",
      caption: `Dating-app ${name} is more honest than real ${name} and that is the bit.`,
      print,
    };
  }

  if (id === "peasant") {
    const job = pickOne(rng, PEASANT_JOBS);
    const tithe = pickOne(rng, PEASANT_TITHES);
    const body = `Occupation: ${job}.\nTithe this week: ${tithe}.\nKnown for: remembering everyone’s bread preference.\nDream: a second spoon.\nFear: the census man who writes in ink.`;
    return {
      id,
      label: "Medieval peasant",
      kicker: "PARISH CENSUS 1347",
      title: `${name} of the Lower Field`,
      body,
      footer: "mark: a thumbprint and a joke",
      caption: `In 1347, ${name} of the Lower Field was ${job}.`,
      print,
    };
  }

  if (id === "obituary") {
    const cause = pickOne(rng, OBIT_CAUSES);
    const survived = pickOne(rng, OBIT_SURVIVED);
    const body = `Died, in a universe that was gentle about it, of ${cause}.\n\nSurvived by ${survived}, and by everyone who still has their last message unread on purpose.\n\nIn lieu of flowers: sit on a bench and do not optimize it.`;
    return {
      id,
      label: "Kind-universe obituary",
      kicker: "THE LOCAL INTELLIGENCER",
      title: `${name}, beloved`,
      body,
      footer: "services at dusk, wherever dusk is",
      caption: `Kind-universe obituary for ${name}: they were tired in a beautiful way.`,
      print,
    };
  }

  if (id === "startup") {
    const co = pickOne(rng, STARTUP_NAMES);
    const pitch = pickOne(rng, STARTUP_PITCHES);
    const body = `${name} is the founder of ${co}.\n\n${pitch}\n\nRaised: a round of applause and $40 in Venmo from a cousin.\nMoat: taste.\nExit: walking outside.`;
    return {
      id,
      label: "If they were a startup",
      kicker: "SEED DECK · CONFIDENTIAL-ISH",
      title: `${co}`,
      body,
      footer: handle ? `${at} · pre-product, post-bit` : "pre-product, post-bit",
      caption: `If ${name} were a startup they would be called ${co}.`,
      print,
    };
  }

  if (id === "dungeon") {
    const klass = pickOne(rng, CLASSES);
    const align = pickOne(rng, ALIGNMENTS);
    const body = `Class: ${klass}\nAlignment: ${align}\nHP: 7 (temporarily 40 when someone asks how they are)\nInventory: a half-written novel, one excellent coat, the group chat mute button.\nQuest: find the other sock and also meaning.`;
    return {
      id,
      label: "Dungeon sheet",
      kicker: "CHARACTER RECORD · LEVEL 1 ADULT",
      title: `${name}`,
      body,
      footer: "DM notes: do not let them roll for initiative in meetings",
      caption: `${name}'s character sheet says ${klass}, ${align}.`,
      print,
    };
  }

  const sign = pickOne(rng, SIGNS);
  const forecast = pickOne(rng, FORECASTS);
  const body = `Rising: ${sign}.\n\nThis week: ${forecast}\n\nDo not check your ex's story. The stars already did, and they are tired of you.`;
  return {
    id,
    label: "Tabloid horoscope",
    kicker: "WEEKLY · FOR ENTERTAINMENT / DOOM",
    title: `${name}'s stars`,
    body,
    footer: handle ? `${at} · void-certified` : "void-certified",
    caption: `This week's horoscope for ${name} is ${sign}.`,
    print,
  };
}

export const UNIVERSE_ORDER = UNIVERSES;
