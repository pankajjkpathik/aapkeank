// ─── Marriage / Partner Compatibility Engine ─────────────────────────────────
// Based on Vedic Numerology: friendship chart, element matching, Kua compatibility,
// grid overlap analysis, and the scoring system from Cossmic Connection Advance Course

import {
  reduce, extractDigits, buildGrid, calcMoolank, calcBhagyank,
  calcKua, type LoShuGrid, NUM_DATA, LUCKY_DATA,
} from "./numerology";
import { FRIENDSHIP_CHART } from "./mobileNumerology";

// ─── Element System ──────────────────────────────────────────────────────────
export const NUMBER_ELEMENT: Record<number, string> = {
  1: "Fire", 2: "Water", 3: "Fire", 4: "Air",
  5: "Earth", 6: "Earth", 7: "Water", 8: "Earth", 9: "Fire",
};

export const ELEMENT_COMPAT: Record<string, Record<string, "supportive" | "neutral" | "destructive">> = {
  Fire:  { Fire: "neutral", Water: "destructive", Earth: "supportive", Air: "supportive" },
  Water: { Fire: "destructive", Water: "neutral", Earth: "neutral", Air: "destructive" },
  Earth: { Fire: "supportive", Water: "neutral", Earth: "neutral", Air: "destructive" },
  Air:   { Fire: "supportive", Water: "destructive", Earth: "destructive", Air: "neutral" },
};

// ─── Kua Group Compatibility ─────────────────────────────────────────────────
// East group: 1,3,4,9  |  West group: 2,5,6,7,8
export function kuaGroup(kua: number): "East" | "West" {
  return [1, 3, 4, 9].includes(kua) ? "East" : "West";
}

// ─── Marriage-specific number pair readings ──────────────────────────────────
export const MARRIAGE_PAIR_READINGS: Record<string, { rating: "excellent" | "good" | "average" | "challenging"; desc: string }> = {
  "1-1": { rating: "challenging", desc: "Two strong-willed leaders — power struggles likely unless mutual respect is established." },
  "1-2": { rating: "excellent", desc: "Sun & Moon — perfect Raja-Rani pairing. Complementary energies create a harmonious union." },
  "1-3": { rating: "excellent", desc: "Sun & Jupiter — mutual respect, wisdom and leadership. Highly auspicious combination." },
  "1-4": { rating: "average", desc: "Sun & Rahu — unconventional pairing. Needs patience; 4 must respect 1's authority." },
  "1-5": { rating: "excellent", desc: "Sun & Mercury — excellent communication, balanced partnership. Very favourable." },
  "1-6": { rating: "good", desc: "Sun & Venus — love and authority blend well. Good romance but ego clashes possible." },
  "1-7": { rating: "average", desc: "Sun & Ketu — spiritual bond possible but emotional disconnect may arise." },
  "1-8": { rating: "challenging", desc: "Sun & Saturn — father-son enmity. Fundamental conflict in authority. Avoid if possible." },
  "1-9": { rating: "excellent", desc: "Sun & Mars — fire meets fire. Strong passion, mutual respect, excellent compatibility." },
  "2-2": { rating: "average", desc: "Two moons — over-emotional, mood swings amplified. Needs grounding influence." },
  "2-3": { rating: "good", desc: "Moon & Jupiter — emotional depth meets wisdom. Nurturing and spiritual connection." },
  "2-4": { rating: "challenging", desc: "Moon & Rahu — emotional turbulence, trust issues. Requires strong commitment." },
  "2-5": { rating: "good", desc: "Moon & Mercury — good communication and emotional understanding." },
  "2-6": { rating: "good", desc: "Moon & Venus — romantic and loving. Beautiful connection but may lack practicality." },
  "2-7": { rating: "excellent", desc: "Moon & Ketu — deep spiritual and intuitive bond. Soulmate connection." },
  "2-8": { rating: "challenging", desc: "Moon & Saturn — emotional vs practical. Saturn's coldness hurts Moon's sensitivity." },
  "2-9": { rating: "challenging", desc: "Moon & Mars — emotional conflict. Mars aggression hurts Moon's sensitivity." },
  "3-3": { rating: "good", desc: "Two Jupiters — wisdom doubled but ego in knowledge may cause friction." },
  "3-4": { rating: "average", desc: "Jupiter & Rahu — unconventional wisdom. Can work with mutual understanding." },
  "3-5": { rating: "excellent", desc: "Jupiter & Mercury — knowledge meets communication. Intellectual powerhouse couple." },
  "3-6": { rating: "challenging", desc: "Jupiter & Venus — Guru-Shishya dynamic. Venus's materialism clashes with Jupiter's idealism." },
  "3-7": { rating: "good", desc: "Jupiter & Ketu — spiritual and philosophical bond. Deep understanding possible." },
  "3-8": { rating: "average", desc: "Jupiter & Saturn — discipline meets wisdom. Respectful but emotionally distant." },
  "3-9": { rating: "excellent", desc: "Jupiter & Mars — fire elements unite. Passionate, driven, and mutually supportive." },
  "4-4": { rating: "challenging", desc: "Two Rahus — chaotic energy doubled. Instability and unpredictability in the relationship." },
  "4-5": { rating: "average", desc: "Rahu & Mercury — intellectual but restless. Needs commitment from both sides." },
  "4-6": { rating: "good", desc: "Rahu & Venus — unconventional romance. Exciting but may lack stability." },
  "4-7": { rating: "good", desc: "Rahu & Ketu — karmic connection. Deep spiritual lessons to learn together." },
  "4-8": { rating: "average", desc: "Rahu & Saturn — both shadowy planets. Heavy karmic bond, challenging but transformative." },
  "4-9": { rating: "challenging", desc: "Rahu & Mars — explosive combination. Arguments and conflicts likely." },
  "5-5": { rating: "good", desc: "Two Mercurys — excellent communication but may overthink the relationship." },
  "5-6": { rating: "excellent", desc: "Mercury & Venus — perfect balance of intellect and love. Harmonious pairing." },
  "5-7": { rating: "good", desc: "Mercury & Ketu — intellectual meets spiritual. Unique bond with deep conversations." },
  "5-8": { rating: "good", desc: "Mercury & Saturn — practical and communicative. Good business and life partnership." },
  "5-9": { rating: "good", desc: "Mercury & Mars — action meets communication. Dynamic and productive partnership." },
  "6-6": { rating: "good", desc: "Two Venus — love and luxury abound but may become superficial without depth." },
  "6-7": { rating: "good", desc: "Venus & Ketu — love meets spirituality. Beautiful connection with depth." },
  "6-8": { rating: "average", desc: "Venus & Saturn — luxury vs austerity. Needs compromise on lifestyle." },
  "6-9": { rating: "good", desc: "Venus & Mars — passionate romance. Strong physical and emotional attraction." },
  "7-7": { rating: "average", desc: "Two Ketus — extreme spiritual focus may isolate the couple from the world." },
  "7-8": { rating: "average", desc: "Ketu & Saturn — both detached energies. May lack warmth and emotional connection." },
  "7-9": { rating: "average", desc: "Ketu & Mars — spiritual warrior meets action. Can work if channelled properly." },
  "8-8": { rating: "challenging", desc: "Two Saturns — heavy karmic burden. Financial and health challenges amplified." },
  "8-9": { rating: "average", desc: "Saturn & Mars — discipline vs aggression. Power struggles likely." },
  "9-9": { rating: "good", desc: "Two Mars — passionate and energetic but anger management is crucial." },
};

function getPairKey(a: number, b: number): string {
  return a <= b ? `${a}-${b}` : `${b}-${a}`;
}

// ─── Grid Overlap Analysis ───────────────────────────────────────────────────
function gridOverlap(g1: LoShuGrid, g2: LoShuGrid): { shared: number[]; onlyA: number[]; onlyB: number[]; complement: number } {
  const shared = [1,2,3,4,5,6,7,8,9].filter(n => g1.counts[n] > 0 && g2.counts[n] > 0);
  const onlyA = [1,2,3,4,5,6,7,8,9].filter(n => g1.counts[n] > 0 && g2.counts[n] === 0);
  const onlyB = [1,2,3,4,5,6,7,8,9].filter(n => g1.counts[n] === 0 && g2.counts[n] > 0);
  // Complement score: how well partner B fills partner A's missing numbers and vice versa
  const aMissing = g1.missing.length;
  const bMissing = g2.missing.length;
  const aFilledByB = g1.missing.filter(n => g2.counts[n] > 0).length;
  const bFilledByA = g2.missing.filter(n => g1.counts[n] > 0).length;
  const totalMissing = aMissing + bMissing;
  const totalFilled = aFilledByB + bFilledByA;
  const complement = totalMissing > 0 ? Math.round((totalFilled / totalMissing) * 100) : 100;
  return { shared, onlyA, onlyB, complement };
}

// ─── Analysis Result ─────────────────────────────────────────────────────────
export interface MarriageAnalysis {
  personA: { name: string; dob: string; moolank: number; bhagyank: number; kua: number; kuaGroup: string; element: string; grid: LoShuGrid; digits: number[] };
  personB: { name: string; dob: string; moolank: number; bhagyank: number; kua: number; kuaGroup: string; element: string; grid: LoShuGrid; digits: number[] };
  // Scores (each 0-100)
  moolankScore: number;
  bhagyankScore: number;
  elementScore: number;
  kuaScore: number;
  gridScore: number;
  overallScore: number;
  // Details
  moolankRelation: "friendly" | "enemy" | "neutral";
  bhagyankRelation: "friendly" | "enemy" | "neutral";
  elementRelation: "supportive" | "neutral" | "destructive";
  kuaMatch: boolean;
  gridOverlap: { shared: number[]; onlyA: number[]; onlyB: number[]; complement: number };
  pairReading: { rating: string; desc: string };
  bhagyankPairReading: { rating: string; desc: string };
  recommendations: string[];
  warnings: string[];
  scoreLabel: string;
}

function getRelation(num: number, target: number): "friendly" | "enemy" | "neutral" {
  const chart = FRIENDSHIP_CHART[num];
  if (!chart) return "neutral";
  if (chart.friendly.includes(target)) return "friendly";
  if (chart.enemy.includes(target)) return "enemy";
  return "neutral";
}

// ─── Main Analysis Function ──────────────────────────────────────────────────
export function analyzeMarriage(
  nameA: string, dobA: string, genderA: "male" | "female",
  nameB: string, dobB: string, genderB: "male" | "female",
): MarriageAnalysis {
  const moolankA = calcMoolank(dobA);
  const bhagyankA = calcBhagyank(dobA);
  const kuaA = calcKua(dobA, genderA);
  const digitsA = extractDigits(dobA);
  const gridA = buildGrid(digitsA);

  const moolankB = calcMoolank(dobB);
  const bhagyankB = calcBhagyank(dobB);
  const kuaB = calcKua(dobB, genderB);
  const digitsB = extractDigits(dobB);
  const gridB = buildGrid(digitsB);

  const elA = NUMBER_ELEMENT[moolankA] || "Earth";
  const elB = NUMBER_ELEMENT[moolankB] || "Earth";

  // 1. Moolank compatibility
  const moolankRelA = getRelation(moolankA, moolankB);
  const moolankRelB = getRelation(moolankB, moolankA);
  // Average both directions
  const moolankRelation: "friendly" | "enemy" | "neutral" =
    moolankRelA === "friendly" && moolankRelB === "friendly" ? "friendly" :
    moolankRelA === "enemy" || moolankRelB === "enemy" ? "enemy" : "neutral";
  const moolankScore = moolankRelation === "friendly" ? 100 : moolankRelation === "neutral" ? 60 : 20;

  // 2. Bhagyank compatibility
  const bhagyankRelA = getRelation(bhagyankA, bhagyankB);
  const bhagyankRelB = getRelation(bhagyankB, bhagyankA);
  const bhagyankRelation: "friendly" | "enemy" | "neutral" =
    bhagyankRelA === "friendly" && bhagyankRelB === "friendly" ? "friendly" :
    bhagyankRelA === "enemy" || bhagyankRelB === "enemy" ? "enemy" : "neutral";
  const bhagyankScore = bhagyankRelation === "friendly" ? 100 : bhagyankRelation === "neutral" ? 60 : 20;

  // 3. Element compatibility
  const elementRelation = ELEMENT_COMPAT[elA]?.[elB] || "neutral";
  const elementScore = elementRelation === "supportive" ? 100 : elementRelation === "neutral" ? 65 : 15;

  // 4. Kua compatibility (same group = compatible)
  const kuaGroupA = kuaGroup(kuaA);
  const kuaGroupB = kuaGroup(kuaB);
  const kuaMatch = kuaGroupA === kuaGroupB;
  const kuaScore = kuaMatch ? 100 : 40;

  // 5. Grid overlap / complement
  const overlap = gridOverlap(gridA, gridB);
  const gridScore = overlap.complement;

  // Overall weighted score
  const overallScore = Math.round(
    moolankScore * 0.25 +
    bhagyankScore * 0.25 +
    elementScore * 0.15 +
    kuaScore * 0.15 +
    gridScore * 0.20
  );

  const scoreLabel = overallScore >= 75 ? "Excellent" : overallScore >= 60 ? "Good" : overallScore >= 50 ? "Average" : "Challenging";

  // Pair readings
  const moolankPairKey = getPairKey(moolankA, moolankB);
  const bhagyankPairKey = getPairKey(bhagyankA, bhagyankB);
  const pairReading = MARRIAGE_PAIR_READINGS[moolankPairKey] || { rating: "average", desc: "A unique combination requiring individual analysis." };
  const bhagyankPairReading = MARRIAGE_PAIR_READINGS[bhagyankPairKey] || { rating: "average", desc: "Destiny numbers create a unique bond." };

  // Recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];

  if (moolankRelation === "friendly") {
    recommendations.push(`Moolank ${moolankA} & ${moolankB} are friendly — natural chemistry and understanding between you.`);
  }
  if (bhagyankRelation === "friendly") {
    recommendations.push(`Bhagyank ${bhagyankA} & ${bhagyankB} are friendly — your life paths support each other beautifully.`);
  }
  if (elementRelation === "supportive") {
    recommendations.push(`${elA} + ${elB} elements are supportive — you naturally energize each other.`);
  }
  if (kuaMatch) {
    recommendations.push(`Both belong to the ${kuaGroupA} Kua group — excellent directional and energy alignment.`);
  }
  if (overlap.complement >= 70) {
    recommendations.push(`Your Lo Shu grids complement each other well (${overlap.complement}%) — you fill each other's missing energies.`);
  }

  // Warnings
  if (moolankRelation === "enemy") {
    warnings.push(`Moolank ${moolankA} & ${moolankB} are enemies — core personality clash. Requires conscious effort and remedies.`);
  }
  if (bhagyankRelation === "enemy") {
    warnings.push(`Bhagyank ${bhagyankA} & ${bhagyankB} are enemies — life path friction. Different destinies may create distance.`);
  }
  if (elementRelation === "destructive") {
    warnings.push(`${elA} & ${elB} elements are destructive to each other — one may suppress the other's energy.`);
  }
  if (!kuaMatch) {
    warnings.push(`Different Kua groups (${kuaGroupA} vs ${kuaGroupB}) — directional preferences may conflict. Adjust home Vastu accordingly.`);
  }
  if (overlap.complement < 40) {
    warnings.push(`Low grid complement (${overlap.complement}%) — your energy gaps are not well covered by each other.`);
  }

  // Remedies based on issues
  if (moolankRelation === "enemy" || bhagyankRelation === "enemy") {
    recommendations.push("Remedy: Both partners should wear Crystal Mala for balancing energies.");
    recommendations.push("Remedy: Place a Budh Yantra in the North direction of your home for harmony.");
    recommendations.push("Remedy: Chant 'Om Shri Ganeshaya Namah' together 11 times every morning.");
  }
  if (elementRelation === "destructive") {
    recommendations.push(`Remedy: Use Number 5 (Earth/Mercury) items in your home to balance ${elA} & ${elB} conflict.`);
  }
  if (!kuaMatch) {
    recommendations.push("Remedy: Sleep in a direction favourable to both Kua numbers. Consult Vastu chart for specifics.");
  }

  return {
    personA: { name: nameA, dob: dobA, moolank: moolankA, bhagyank: bhagyankA, kua: kuaA, kuaGroup: kuaGroupA, element: elA, grid: gridA, digits: digitsA },
    personB: { name: nameB, dob: dobB, moolank: moolankB, bhagyank: bhagyankB, kua: kuaB, kuaGroup: kuaGroupB, element: elB, grid: gridB, digits: digitsB },
    moolankScore, bhagyankScore, elementScore, kuaScore, gridScore, overallScore,
    moolankRelation, bhagyankRelation, elementRelation, kuaMatch,
    gridOverlap: overlap, pairReading, bhagyankPairReading,
    recommendations, warnings, scoreLabel,
  };
}