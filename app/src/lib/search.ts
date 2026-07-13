import { allSpecialties } from './data';
import { entryPath } from './entry';
import { classifiedCount, isEntryLevel } from './entrylevel';
import type { SpecialtyRecord } from './types';

/**
 * Search the jobs by what a person would actually type.
 *
 * A plain substring search is worse than no search here, and the words that prove it
 * are the obvious ones. Type "drones" into 510 real military jobs and you get ZERO
 * results — because the military never says drone. It says Unmanned Aircraft System,
 * UAS, RPA, sensor operator. Type "video games": zero. Type "hacking": zero. The jobs
 * are all there; the vocabulary isn't.
 *
 * A reader who searches "drones", sees "no results", and concludes the military has no
 * drone jobs has been misinformed by a search box — the same silent-absence failure
 * this site exists to prevent, just wearing a different hat.
 *
 * So there is a vocabulary layer. It maps the word a seventeen-year-old types to the
 * words the services actually use. It is a SEARCH AID, not a data claim: it never
 * invents a job, never changes a record, and never asserts that a job is something it
 * isn't. It only widens the net so a real job can be found by its real-world name.
 */

/** Colloquial term -> the terms the military actually uses. */
const VOCAB: Record<string, string[]> = {
  // The word nobody in uniform says.
  drone: ['unmanned', 'uas', 'rpa', 'remotely piloted', 'sensor operator'],
  drones: ['unmanned', 'uas', 'rpa', 'remotely piloted', 'sensor operator'],
  uav: ['unmanned', 'uas', 'rpa', 'remotely piloted'],

  // "I want to sit at a console and run something."
  'video game': ['simulation', 'sensor', 'radar', 'air traffic', 'fire control', 'targeting', 'unmanned'],
  'video games': ['simulation', 'sensor', 'radar', 'air traffic', 'fire control', 'targeting', 'unmanned'],
  gaming: ['simulation', 'sensor', 'radar', 'targeting'],
  esports: ['simulation', 'sensor', 'radar'],

  hacking: ['cyber', 'network', 'signals intelligence', 'cryptologic'],
  hacker: ['cyber', 'network', 'signals intelligence', 'cryptologic'],
  hack: ['cyber', 'network', 'cryptologic'],
  coding: ['cyber', 'software', 'programmer', 'information systems'],
  programming: ['cyber', 'software', 'programmer', 'information systems'],
  computers: ['information systems', 'network', 'cyber', 'computer'],
  it: ['information systems', 'network'],

  guns: ['infantry', 'small arms', 'weapons', 'gunner', 'armament', 'ordnance', 'artillery'],
  shooting: ['infantry', 'small arms', 'weapons', 'gunner', 'marksman'],
  sniper: ['scout', 'reconnaissance', 'infantry', 'marksman'],
  bombs: ['explosive ordnance', 'eod', 'ammunition', 'demolition', 'ordnance'],
  explosives: ['explosive ordnance', 'eod', 'demolition', 'ammunition'],

  cars: ['wheeled vehicle', 'automotive', 'motor transport'],
  engines: ['powerplant', 'engine', 'propulsion'],
  mechanic: ['repairer', 'mechanic'],
  planes: ['aircraft', 'airframe', 'avionics'],
  airplanes: ['aircraft', 'airframe', 'avionics'],
  jets: ['aircraft', 'tactical aircraft', 'avionics'],
  helicopters: ['rotary', 'helicopter'],
  boats: ['boatswain', 'seaman', 'coxswain', 'watercraft', 'marine'],
  ships: ['boatswain', 'seaman', 'hull', 'damage control', 'machinist'],
  submarines: ['submarine', 'sonar', 'nuclear'],
  diving: ['diver', 'salvage', 'underwater'],
  space: ['space', 'satellite', 'orbital', 'missile warning'],
  satellites: ['space', 'satellite', 'communications'],
  rockets: ['missile', 'artillery', 'space', 'launch'],
  nuclear: ['nuclear', 'reactor', 'power'],

  doctor: ['medic', 'medical', 'health', 'corpsman'],
  medicine: ['medic', 'medical', 'health', 'corpsman', 'pharmacy'],
  nurse: ['medical', 'health', 'corpsman', 'medic'],
  paramedic: ['medic', 'corpsman', 'emergency'],
  dentist: ['dental'],
  vet: ['veterinary', 'animal'],
  animals: ['veterinary', 'working dog', 'canine'],
  dogs: ['working dog', 'canine'],

  police: ['military police', 'law enforcement', 'security forces', 'master-at-arms'],
  cop: ['military police', 'law enforcement', 'security forces'],
  detective: ['investigator', 'criminal', 'counterintelligence'],
  spy: ['counterintelligence', 'human intelligence', 'cryptologic', 'intelligence'],
  intelligence: ['intelligence', 'analyst', 'cryptologic', 'geospatial'],
  languages: ['linguist', 'cryptologic', 'interpreter', 'language'],
  translator: ['linguist', 'interpreter', 'cryptologic'],

  cooking: ['culinary', 'food', 'cook'],
  chef: ['culinary', 'food service'],
  music: ['musician', 'band'],
  photography: ['combat camera', 'photographer', 'visual information', 'mass communication'],
  video: ['combat camera', 'visual information', 'broadcast', 'mass communication'],
  journalism: ['public affairs', 'mass communication', 'broadcast'],
  writing: ['public affairs', 'mass communication', 'journalist'],
  art: ['visual information', 'graphic', 'illustrator'],

  law: ['legal', 'paralegal', 'judge advocate'],
  lawyer: ['legal', 'paralegal', 'judge advocate'],
  business: ['administration', 'finance', 'human resources'],
  finance: ['finance', 'financial', 'disbursing', 'comptroller'],
  accounting: ['finance', 'financial', 'auditing', 'disbursing'],
  hr: ['human resources', 'personnel', 'administration'],
  logistics: ['logistics', 'supply', 'distribution'],
  driving: ['motor transport', 'transportation', 'vehicle operator'],
  building: ['engineer', 'construction', 'builder', 'carpentry', 'masonry'],
  construction: ['construction', 'builder', 'equipment operator', 'engineer'],
  electrician: ['electrician', 'electrical', 'power'],
  plumbing: ['utilities', 'water', 'plumber'],
  welding: ['welder', 'metal', 'machinist', 'fabrication'],
  weather: ['weather', 'meteorolog', 'aerographer'],
  firefighter: ['firefighting', 'fire protection', 'rescue'],
  rescue: ['rescue', 'survival', 'pararescue', 'search'],
  chemistry: ['chemical', 'cbrn', 'biological'],
  engineering: ['engineer'],
  electronics: ['electronic', 'avionics', 'radar'],
  radio: ['communications', 'radio', 'transmissions', 'signal'],
  radar: ['radar', 'air traffic', 'fire control'],
  maps: ['geospatial', 'topographic', 'survey', 'imagery'],
  drawing: ['drafting', 'geospatial', 'illustrator'],
  teaching: ['instructor', 'training'],
  parachute: ['parachute', 'airborne', 'rigger', 'jump'],
  scuba: ['diver', 'underwater', 'salvage'],
  fitness: ['fitness', 'physical training'],
  religion: ['religious', 'chaplain'],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+ ]+/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Expand a reader's query into the terms actually present in the data.
 * Returns the original terms plus any military vocabulary they map to.
 */
export function expandQuery(q: string): { terms: string[]; translated: string[] } {
  const raw = norm(q);
  if (!raw) return { terms: [], translated: [] };

  const terms = new Set<string>();
  const translated = new Set<string>();

  // Whole-phrase match first ("video games" beats "video" + "games").
  if (VOCAB[raw]) {
    VOCAB[raw].forEach((t) => {
      terms.add(t);
      translated.add(t);
    });
  }
  for (const w of raw.split(' ')) {
    if (w.length < 2) continue;
    terms.add(w);
    // singular <-> plural, cheaply
    const alt = w.endsWith('s') ? w.slice(0, -1) : `${w}s`;
    const syn = VOCAB[w] ?? VOCAB[alt];
    if (syn) syn.forEach((t) => { terms.add(t); translated.add(t); });
  }
  return { terms: [...terms], translated: [...translated] };
}

function haystack(s: SpecialtyRecord): string {
  const cw = s.civilian_crosswalk;
  return norm(
    [
      s.code,
      s.name,
      s.what_it_is,
      s.entry_requirements?.other,
      ...(cw?.example_civilian_titles ?? []),
      ...(cw?.relevant_certifications ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * Does `term` appear in `text` as a WORD, not as a fragment inside one?
 *
 * Substring matching is a trap here. The expansion of "drones" includes "rpa", and
 * "rpa" is inside "pu-rpa-se" — so a substring search for drone jobs returned a
 * heating-and-air-conditioning specialist. Short military abbreviations (uas, rpa,
 * eod, it) make this failure the norm, not the exception.
 */
function hasWord(text: string, term: string): boolean {
  const i = text.indexOf(term);
  if (i < 0) return false;
  const before = i === 0 ? ' ' : text[i - 1];
  const after = text[i + term.length] ?? ' ';
  return !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after);
}

/**
 * Entry-level jobs matching a free-text query, best first.
 *
 * Ranked, not just filtered. A match in the job's NAME means far more than a match
 * buried in a description, and a search that returns 172 jobs for "cars" is as
 * useless as one that returns none for "drones" — it has just failed in the other
 * direction. Same fail-closed entry-level gate as everywhere else.
 */
export function searchEntryLevel(q: string): SpecialtyRecord[] {
  const { terms } = expandQuery(q);
  if (!terms.length) return [];

  const pool = allSpecialties
    .filter((s) => entryPath(s).kind === 'enlisted')
    .filter((s) => (classifiedCount > 0 ? isEntryLevel(s.id) : true));

  const scored = pool
    .map((s) => {
      const name = norm(`${s.code} ${s.name}`);
      const titles = norm((s.civilian_crosswalk?.example_civilian_titles ?? []).join(' '));
      const body = haystack(s);

      let score = 0;
      for (const t of terms) {
        if (hasWord(name, t)) score += 10;      // it is what the job is called
        else if (hasWord(titles, t)) score += 4; // it is what the job becomes
        else if (hasWord(body, t)) score += 1;   // it is mentioned somewhere
      }
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.s);
}

/** The suggestions shown under the box — the words people actually type. */
export const SEARCH_EXAMPLES = [
  'drones',
  'video games',
  'hacking',
  'helicopters',
  'engines',
  'medicine',
  'dogs',
  'explosives',
  'languages',
  'weather',
];
