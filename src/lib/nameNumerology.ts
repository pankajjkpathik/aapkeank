// ─── Name Numerology Engine (Chaldean System) ──────────────────────────────
import { reduce, calcMoolank, calcBhagyank } from "./numerology";

// ─── Chaldean Letter-to-Number Map ──────────────────────────────────────────
const CHALDEAN: Record<string, number> = {
  A:1,I:1,J:1,Q:1,Y:1,
  B:2,K:2,R:2,
  C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,
  E:5,H:5,N:5,X:5,
  U:6,V:6,W:6,
  O:7,Z:7,
  F:8,P:8,
};

// ─── Pythagorean Letter-to-Number Map ───────────────────────────────────────
const PYTHAGOREAN: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const VOWELS = new Set(["A","E","I","O","U"]);

export interface NameBreakdown {
  letter: string;
  chaldean: number;
  pythagorean: number;
  isVowel: boolean;
}

export interface NameAnalysis {
  fullName: string;
  breakdown: NameBreakdown[];
  chaldeanTotal: number;
  chaldeanReduced: number;
  pythagoreanTotal: number;
  pythagoreanReduced: number;
  soulUrge: number;       // vowels only (Chaldean)
  personality: number;    // consonants only (Chaldean)
  expressionNumber: number; // full name Pythagorean reduced
}

export interface NameCompatibility {
  name: string;
  dob: string;
  moolank: number;
  bhagyank: number;
  nameAnalysis: NameAnalysis;
  moolankFriendly: boolean;
  bhagyankFriendly: boolean;
  overallScore: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  soulUrgeReading: string;
  personalityReading: string;
  expressionReading: string;
  suggestions: NameSuggestion[];
}

export interface NameSuggestion {
  name: string;
  chaldeanReduced: number;
  score: number;
  reason: string;
}

// ─── Friendship chart for name numbers ──────────────────────────────────────
const FRIENDLY: Record<number, number[]> = {
  1: [1,2,3,5,9],
  2: [1,3,5],
  3: [1,2,3,5,7],
  4: [1,4,6,7,8],
  5: [1,2,3,5,6],
  6: [4,5,6,7],
  7: [1,4,5,6],
  8: [3,4,5,6,8],
  9: [1,3,5,9],
};

const ENEMY: Record<number, number[]> = {
  1: [8],
  2: [4,8,9],
  3: [6],
  4: [2,9],
  5: [],
  6: [3],
  7: [],
  8: [1,2],
  9: [2,4],
};

// ─── Number Readings ────────────────────────────────────────────────────────
const NUMBER_READINGS: Record<number, { soul: string; personality: string; expression: string; keywords: string[] }> = {
  1: {
    soul: "You crave independence, leadership, and originality. Your inner desire is to be first and to pioneer new paths.",
    personality: "Others see you as confident, ambitious, and authoritative. You project strength and decisiveness.",
    expression: "Your life purpose involves leadership, innovation, and creating new ventures. You are destined to lead.",
    keywords: ["Leader","Independent","Pioneer","Ambitious","Courageous"],
  },
  2: {
    soul: "You deeply desire harmony, partnership, and emotional connection. Peace and diplomacy drive your inner world.",
    personality: "Others perceive you as gentle, cooperative, and tactful. You radiate warmth and understanding.",
    expression: "Your purpose is to bring balance, mediate, and support others. Partnerships define your path.",
    keywords: ["Diplomat","Peacemaker","Sensitive","Cooperative","Intuitive"],
  },
  3: {
    soul: "You crave self-expression, creativity, and joy. Your inner world is vibrant with ideas and inspiration.",
    personality: "Others see you as charismatic, witty, and sociable. You light up any room you enter.",
    expression: "Your purpose involves creative expression, communication, and inspiring others through art or words.",
    keywords: ["Creative","Expressive","Optimistic","Social","Inspiring"],
  },
  4: {
    soul: "You desire stability, order, and tangible results. Building solid foundations drives your inner satisfaction.",
    personality: "Others see you as dependable, hardworking, and practical. You project reliability and discipline.",
    expression: "Your purpose is to build lasting structures, systems, and organizations. You are the master builder.",
    keywords: ["Builder","Disciplined","Practical","Stable","Hardworking"],
  },
  5: {
    soul: "You crave freedom, adventure, and variety. Your inner world seeks change and new experiences constantly.",
    personality: "Others see you as dynamic, versatile, and magnetic. You radiate energy and enthusiasm.",
    expression: "Your purpose involves communication, travel, and embracing change. You are the master of adaptability.",
    keywords: ["Adventurous","Dynamic","Versatile","Communicator","Free-spirited"],
  },
  6: {
    soul: "You deeply desire love, family, and beauty. Nurturing others and creating harmony fills your soul.",
    personality: "Others see you as caring, responsible, and artistic. You project warmth and domestic comfort.",
    expression: "Your purpose involves service, healing, and creating beauty. Family and community are your domain.",
    keywords: ["Nurturer","Loving","Responsible","Artistic","Harmonious"],
  },
  7: {
    soul: "You crave knowledge, wisdom, and spiritual understanding. Your inner world is deep and contemplative.",
    personality: "Others see you as mysterious, intellectual, and analytical. You project depth and introspection.",
    expression: "Your purpose involves research, spiritual growth, and uncovering hidden truths. You are the seeker.",
    keywords: ["Seeker","Analytical","Spiritual","Wise","Mysterious"],
  },
  8: {
    soul: "You desire power, success, and material achievement. Ambition and authority drive your inner world.",
    personality: "Others see you as powerful, successful, and commanding. You project authority and confidence.",
    expression: "Your purpose involves business, finance, and exercising power wisely. You are destined for authority.",
    keywords: ["Powerful","Ambitious","Executive","Karmic","Authoritative"],
  },
  9: {
    soul: "You desire universal love, compassion, and service to humanity. Your inner world is selfless and spiritual.",
    personality: "Others see you as compassionate, generous, and wise. You project idealism and humanitarian values.",
    expression: "Your purpose involves humanitarian service, teaching, and completion. You embrace universal wisdom.",
    keywords: ["Humanitarian","Compassionate","Wise","Generous","Visionary"],
  },
};

// ─── Analysis Functions ─────────────────────────────────────────────────────

export function analyzeName(name: string): NameAnalysis {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, "");
  const breakdown: NameBreakdown[] = [];
  let chTotal = 0, pyTotal = 0, vowelTotal = 0, consTotal = 0;

  for (const ch of upper) {
    const chVal = CHALDEAN[ch] || 0;
    const pyVal = PYTHAGOREAN[ch] || 0;
    const isVowel = VOWELS.has(ch);
    breakdown.push({ letter: ch, chaldean: chVal, pythagorean: pyVal, isVowel });
    chTotal += chVal;
    pyTotal += pyVal;
    if (isVowel) vowelTotal += chVal;
    else consTotal += chVal;
  }

  return {
    fullName: name,
    breakdown,
    chaldeanTotal: chTotal,
    chaldeanReduced: reduce(chTotal),
    pythagoreanTotal: pyTotal,
    pythagoreanReduced: reduce(pyTotal),
    soulUrge: reduce(vowelTotal),
    personality: reduce(consTotal),
    expressionNumber: reduce(pyTotal),
  };
}

export function analyzeNameCompatibility(name: string, dob: string): NameCompatibility {
  const moolank = calcMoolank(dob);
  const bhagyank = calcBhagyank(dob);
  const nameAnalysis = analyzeName(name);
  const nameNum = nameAnalysis.chaldeanReduced;

  const moolankFriendly = (FRIENDLY[moolank] || []).includes(nameNum);
  const bhagyankFriendly = (FRIENDLY[bhagyank] || []).includes(nameNum);
  const moolankEnemy = (ENEMY[moolank] || []).includes(nameNum);
  const bhagyankEnemy = (ENEMY[bhagyank] || []).includes(nameNum);

  // Scoring
  let score = 50;
  if (moolankFriendly) score += 20;
  else if (moolankEnemy) score -= 15;
  if (bhagyankFriendly) score += 20;
  else if (bhagyankEnemy) score -= 15;
  // Soul urge alignment
  if ((FRIENDLY[moolank] || []).includes(nameAnalysis.soulUrge)) score += 10;
  // Expression alignment
  if ((FRIENDLY[bhagyank] || []).includes(nameAnalysis.expressionNumber)) score += 10;
  // Personality alignment
  if ((FRIENDLY[moolank] || []).includes(nameAnalysis.personality)) score += 5;
  // Perfect match bonus
  if (nameNum === moolank || nameNum === bhagyank) score += 10;

  score = Math.min(100, Math.max(0, score));

  const verdict = score >= 80 ? "Excellent – Your name is perfectly aligned with your cosmic vibrations!"
    : score >= 60 ? "Good – Your name has strong compatibility with minor areas for improvement."
    : score >= 40 ? "Average – Your name has some misalignments that may create obstacles."
    : "Needs Correction – Your name vibration conflicts with your birth numbers.";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (moolankFriendly) strengths.push(`Name number ${nameNum} is friendly with Moolank ${moolank} – supports identity & personality`);
  if (bhagyankFriendly) strengths.push(`Name number ${nameNum} is friendly with Bhagyank ${bhagyank} – enhances destiny & fortune`);
  if (nameNum === moolank) strengths.push("Name number equals Moolank – powerful self-alignment");
  if (nameNum === bhagyank) strengths.push("Name number equals Bhagyank – destiny amplification");
  if (moolankEnemy) weaknesses.push(`Name number ${nameNum} conflicts with Moolank ${moolank} – may cause inner friction`);
  if (bhagyankEnemy) weaknesses.push(`Name number ${nameNum} conflicts with Bhagyank ${bhagyank} – may block destiny fulfillment`);
  if (!moolankFriendly && !moolankEnemy) weaknesses.push(`Name number ${nameNum} is neutral to Moolank ${moolank} – neither supports nor hinders`);

  const nr = NUMBER_READINGS[nameNum] || NUMBER_READINGS[1];

  // Generate suggestions
  const suggestions = generateNameSuggestions(name, moolank, bhagyank);

  return {
    name, dob, moolank, bhagyank, nameAnalysis,
    moolankFriendly, bhagyankFriendly,
    overallScore: score, verdict,
    strengths, weaknesses,
    soulUrgeReading: NUMBER_READINGS[nameAnalysis.soulUrge]?.soul || "",
    personalityReading: NUMBER_READINGS[nameAnalysis.personality]?.personality || "",
    expressionReading: NUMBER_READINGS[nameAnalysis.expressionNumber]?.expression || "",
    suggestions,
  };
}

// ─── Name Correction Suggestions ────────────────────────────────────────────

function generateNameSuggestions(name: string, moolank: number, bhagyank: number): NameSuggestion[] {
  const targetNums = [...new Set([moolank, bhagyank, ...(FRIENDLY[moolank] || []), ...(FRIENDLY[bhagyank] || [])])];
  const suggestions: NameSuggestion[] = [];
  const original = analyzeName(name);

  // Strategy 1: Add letters to end
  const addLetters = ["A","E","I","O","H","S","N","R","K"];
  for (const letter of addLetters) {
    const newName = name.trim() + letter.toLowerCase();
    const analysis = analyzeName(newName);
    if (targetNums.includes(analysis.chaldeanReduced) && analysis.chaldeanReduced !== original.chaldeanReduced) {
      const score = calculateSuggestionScore(analysis.chaldeanReduced, moolank, bhagyank);
      if (score > 60) {
        suggestions.push({
          name: capitalizeFirst(newName),
          chaldeanReduced: analysis.chaldeanReduced,
          score,
          reason: `Adding '${letter}' changes name number to ${analysis.chaldeanReduced}, which is ${getFriendshipLabel(analysis.chaldeanReduced, moolank, bhagyank)}`,
        });
      }
    }
  }

  // Strategy 2: Double a letter
  const upper = name.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    if (/[A-Z]/.test(upper[i])) {
      const newName = name.slice(0, i+1) + name[i] + name.slice(i+1);
      const analysis = analyzeName(newName);
      if (targetNums.includes(analysis.chaldeanReduced) && analysis.chaldeanReduced !== original.chaldeanReduced) {
        const score = calculateSuggestionScore(analysis.chaldeanReduced, moolank, bhagyank);
        if (score > 60 && !suggestions.find(s => s.chaldeanReduced === analysis.chaldeanReduced && s.name.length === newName.length)) {
          suggestions.push({
            name: capitalizeFirst(newName),
            chaldeanReduced: analysis.chaldeanReduced,
            score,
            reason: `Doubling '${name[i]}' changes name number to ${analysis.chaldeanReduced}, ${getFriendshipLabel(analysis.chaldeanReduced, moolank, bhagyank)}`,
          });
        }
      }
    }
  }

  // Strategy 3: Add prefix (Shri, Dr, etc.)
  const prefixes = ["Shri ", "Shree "];
  for (const prefix of prefixes) {
    const newName = prefix + name.trim();
    const analysis = analyzeName(newName);
    if (targetNums.includes(analysis.chaldeanReduced) && analysis.chaldeanReduced !== original.chaldeanReduced) {
      const score = calculateSuggestionScore(analysis.chaldeanReduced, moolank, bhagyank);
      suggestions.push({
        name: newName,
        chaldeanReduced: analysis.chaldeanReduced,
        score,
        reason: `Prefix '${prefix.trim()}' changes total to ${analysis.chaldeanReduced}, ${getFriendshipLabel(analysis.chaldeanReduced, moolank, bhagyank)}`,
      });
    }
  }

  // Deduplicate and sort by score
  const unique = suggestions.reduce((acc, s) => {
    if (!acc.find(x => x.name === s.name)) acc.push(s);
    return acc;
  }, [] as NameSuggestion[]);

  return unique.sort((a, b) => b.score - a.score).slice(0, 8);
}

function calculateSuggestionScore(nameNum: number, moolank: number, bhagyank: number): number {
  let score = 50;
  if (nameNum === moolank || nameNum === bhagyank) score += 30;
  if ((FRIENDLY[moolank] || []).includes(nameNum)) score += 20;
  if ((FRIENDLY[bhagyank] || []).includes(nameNum)) score += 20;
  if ((ENEMY[moolank] || []).includes(nameNum)) score -= 20;
  if ((ENEMY[bhagyank] || []).includes(nameNum)) score -= 20;
  return Math.min(100, Math.max(0, score));
}

function getFriendshipLabel(nameNum: number, moolank: number, bhagyank: number): string {
  const parts: string[] = [];
  if (nameNum === moolank) parts.push("equals Moolank");
  else if ((FRIENDLY[moolank] || []).includes(nameNum)) parts.push("friendly with Moolank");
  if (nameNum === bhagyank) parts.push("equals Bhagyank");
  else if ((FRIENDLY[bhagyank] || []).includes(nameNum)) parts.push("friendly with Bhagyank");
  return parts.join(" & ") || "compatible";
}

function capitalizeFirst(s: string): string {
  return s.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export function getNumberReading(n: number) {
  return NUMBER_READINGS[n] || NUMBER_READINGS[1];
}
