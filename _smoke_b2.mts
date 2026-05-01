import { mockMeets } from "./lib/mockMeets";
import { getAttendeeTier } from "./lib/meetUtils";

const personas = ["tereza", "daniel", "klara", "tomas", "shawn"];
const canonical: Record<string, string> = {
  tereza: "meet-1",
  daniel: "meet-reactive-spring",
  klara: "meet-care-1",
  tomas: "meet-7",
  shawn: "meet-1",
};

console.log("Tier distribution per persona on their canonical meet:");
console.log("(t1 = self/connected, t2 = familiar/pending/inbound/open, t3 = locked-no-relation)");
console.log();
for (const persona of personas) {
  const meetId = canonical[persona];
  const meet = mockMeets.find((m) => m.id === meetId);
  if (!meet) { console.log(`${persona}: ${meetId} NOT FOUND`); continue; }
  const tiers = { 1: 0, 2: 0, 3: 0 };
  for (const a of meet.attendees) {
    tiers[getAttendeeTier(a, persona)]++;
  }
  console.log(
    `${persona.padEnd(8)} on ${meetId.padEnd(22)} (${meet.attendees.length} attendees): ` +
    `t1=${tiers[1]}  t2=${tiers[2]}  t3=${tiers[3]}`
  );
}

console.log();
console.log("Locked-chip-list check (any meet with ≥1 t3 attendee from a persona's view):");
for (const persona of personas) {
  const meetsWithLocked = mockMeets.filter(m => 
    m.attendees.some(a => getAttendeeTier(a, persona) === 3)
  );
  console.log(`  ${persona.padEnd(8)}: ${meetsWithLocked.length}/${mockMeets.length} meets have ≥1 locked attendee`);
}
