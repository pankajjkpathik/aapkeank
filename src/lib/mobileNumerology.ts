// ─── Mobile Numerology Engine ──────────────────────────────────────────────────
// Based on Conceptual / Vedic Mobile Numerology principles

import { reduce, extractDigits, buildGrid, calcMoolank, calcBhagyank, type LoShuGrid } from "./numerology";

// ─── Number Friendship Chart ─────────────────────────────────────────────────
export const FRIENDSHIP_CHART: Record<number, { friendly: number[]; enemy: number[]; neutral: number[] }> = {
  1: { friendly: [1, 2, 3, 5, 9], enemy: [8], neutral: [4, 6, 7] },
  2: { friendly: [1, 3, 5], enemy: [4, 8, 9], neutral: [2, 6, 7] },
  3: { friendly: [1, 2, 3, 5, 7], enemy: [6], neutral: [4, 8, 9] },
  4: { friendly: [1, 4, 6, 7, 8], enemy: [2, 9], neutral: [3, 5] },
  5: { friendly: [1, 2, 3, 5, 6], enemy: [], neutral: [4, 7, 8, 9] },
  6: { friendly: [4, 5, 6, 7], enemy: [3], neutral: [1, 2, 8, 9] },
  7: { friendly: [1, 4, 5, 6], enemy: [], neutral: [2, 3, 7, 8, 9] },
  8: { friendly: [3, 4, 5, 6, 8], enemy: [1, 2], neutral: [7, 9] },
  9: { friendly: [1, 3, 5], enemy: [2, 4], neutral: [6, 7, 8, 9] },
};

// ─── Number Attributes (Conceptual Numerology) ──────────────────────────────
export const NUMBER_ATTRIBUTES: Record<number, { keywords: string[]; areas: string[] }> = {
  1: {
    keywords: ["Leadership", "Authority", "Status", "Confidence"],
    areas: ["Name & fame", "Government job", "Health & immunity", "Higher position", "IAS/IPS", "Courage"],
  },
  2: {
    keywords: ["Emotion", "Intuition", "Partnership", "Diplomacy"],
    areas: ["Partnerships", "Emotional balance", "Artistic work", "Counselling", "Nurturing"],
  },
  3: {
    keywords: ["Knowledge", "Mentorship", "Wisdom", "Teaching"],
    areas: ["Teaching", "Mentorship", "Professors", "Consultants", "Spiritual growth"],
  },
  4: {
    keywords: ["Stability", "Hard work", "Routine", "Discipline"],
    areas: ["Real estate", "Construction", "Engineering", "Technology", "Systematic work"],
  },
  5: {
    keywords: ["Balance", "Business", "Communication", "Money"],
    areas: ["Overall balance", "Business", "Communication", "Consultation", "Finance"],
  },
  6: {
    keywords: ["Luxury", "Glamour", "Love", "Romance"],
    areas: ["Luxury & glamour", "Love & romance", "Relationships", "Marriage", "Travel", "Brand conscious"],
  },
  7: {
    keywords: ["Spirituality", "Mysticism", "Research", "Healing"],
    areas: ["Spiritual growth", "Research", "Healing", "Occult sciences", "Deep thinking"],
  },
  8: {
    keywords: ["Power", "Karma", "Ambition", "Justice"],
    areas: ["Legal matters", "Karma", "Power", "Large organisations", "Politics"],
  },
  9: {
    keywords: ["Energy", "Courage", "Humanitarian", "Action"],
    areas: ["Military/police", "Sports", "Surgery", "Humanitarian work", "Leadership"],
  },
};

// ─── Beneficial / Neutral / Malefic base numbers ────────────────────────────
export const BENEFICIAL_TOTALS = [1, 3, 5, 6];
export const NEUTRAL_TOTALS = [2, 9];
export const MALEFIC_TOTALS = [4, 7, 8];

// ─── Mobile Digit-Pair Combination Readings ─────────────────────────────────
export const COMBO_READINGS: Record<string, string[]> = {
  "12": ["Attractive/photogenic face", "Good at saving money", "Life partner will be helpful"],
  "21": ["Spend more than they earn", "Generally have an attractive face", "Impulsive spending habits"],
  "13": ["Good advisor/counsellor", "Popular in friend circle", "Very professional & known for knowledge", "Will stay with father", "Good name & fame"],
  "31": ["Good advisor/counsellor", "Popular in friend circle", "Very professional & known for knowledge", "Will stay with father", "Good name & fame"],
  "14": ["Loan liability", "Legal notice possible", "Health issues", "Will have to work extra hard"],
  "41": ["Loan liability", "Legal notice possible", "Health issues", "Will have to work extra hard"],
  "15": ["Father's popularity increases", "They make their father famous", "Will get money without hard work", "Benefits from government"],
  "51": ["Father's popularity increases", "They make their father famous", "Will get money without hard work", "Benefits from government"],
  "16": ["Spouse health issues", "Married life disputes", "Less income during this number period", "Skin problems / UTI problems"],
  "61": ["Spouse health issues", "Married life disputes", "Less income during this number period", "Skin problems / UTI problems"],
  "17": ["Money-related work never stops", "Someone close in government job", "May work in MNC with extreme support", "Chances of 2 marriages", "Early job & early marriage"],
  "71": ["Money-related work never stops", "Someone close in government job", "May work in MNC with extreme support", "Chances of 2 marriages", "Early job & early marriage"],
  "18": ["Spouse health issues", "Issues related to government", "Needs to change job frequently", "Understanding issues between father and son", "Court cases / legal issues", "Disturbance in family"],
  "81": ["Spouse health issues", "Issues related to government", "Needs to change job frequently", "Understanding issues between father and son", "Court cases / legal issues", "Disturbance in family"],
  "19": ["You own what you want", "Always on a high place", "Possessive nature", "Professional person", "Independent work", "Good leader"],
  "91": ["You own what you want", "Always on a high place", "Possessive nature", "Professional person", "Independent work", "Good leader"],
  "23": ["Many enemies, but none can harm", "Can become egoistic", "Deprived of child's happiness"],
  "32": ["Many enemies, but none can harm", "Can become egoistic", "Deprived of child's happiness"],
  "24": ["Has patience to achieve goals", "Always making new plans", "Negative/destructive thinking tendency"],
  "42": ["Has patience to achieve goals", "Always making new plans", "Negative/destructive thinking tendency"],
  "25": ["Can work in medical line / healing", "Success through air travel", "Avoid finance-related stuff", "Good knowledge", "Good doctor/astrologer", "One who gives bail to others"],
  "52": ["Can work in medical line / healing", "Success through air travel", "Avoid finance-related stuff", "Good knowledge", "Good doctor/astrologer", "One who gives bail to others"],
  "26": ["Barrier in studies or break in education", "Girls: problems with mother-in-law", "Attraction towards money or opposite sex", "Chances of less sperm count or diabetes"],
  "62": ["Barrier in studies or break in education", "Girls: problems with mother-in-law", "Attraction towards money or opposite sex", "Chances of less sperm count or diabetes"],
  "27": ["Joint pain / arthritis", "Urine disease possible"],
  "72": ["Joint pain / arthritis", "Urine disease possible"],
  "28": ["Person has decent money", "Needs to spend money on medicine/hospital", "2 marriages in the family", "Beware of bad company", "Beware of water", "Egoistic", "Accident prone", "Seepage on walls"],
  "82": ["Person has decent money", "Needs to spend money on medicine/hospital", "2 marriages in the family", "Beware of bad company", "Beware of water", "Egoistic", "Accident prone", "Seepage on walls"],
  "29": ["Have decent amount of money", "Live happily on someone else's money", "Person becomes egoistic", "Money without hard work"],
  "92": ["Have decent amount of money", "Live happily on someone else's money", "Person becomes egoistic", "Money without hard work"],
  "34": ["Legs shivering", "Paralysis risk to family member", "Breathing-related issues", "Risk of heart issues in family"],
  "43": ["Legs shivering", "Paralysis risk to family member", "Breathing-related issues", "Risk of heart issues in family"],
  "35": ["Success away from family", "Fear of father leads to success", "Good economic condition but liquidity issues"],
  "53": ["Success away from family", "Fear of father leads to success", "Good economic condition but liquidity issues"],
  "36": ["Principle-oriented person", "Barrier in studies", "Knowledgeable but struggles", "Success after marriage", "Higher education", "Religious"],
  "63": ["Principle-oriented person", "Barrier in studies", "Knowledgeable but struggles", "Success after marriage", "Higher education", "Religious"],
  "37": ["Raj Yoga", "Benefits from knowledge", "Good advisor", "Success in love & affairs", "Complete personality"],
  "73": ["Raj Yoga", "Benefits from knowledge", "Good advisor", "Success in love & affairs", "Complete personality"],
  "38": ["Real estate agent", "Good consultant/counsellor", "Always the peacemaker", "Success after marriage", "Judge/astrologer/consultant/mediator", "Success after hard work"],
  "83": ["Real estate agent", "Good consultant/counsellor", "Always the peacemaker", "Success after marriage", "Judge/astrologer/consultant/mediator", "Success after hard work"],
  "39": ["Loves to show off", "Dual nature person", "More hard work, less result", "Can be doctor, politician, leader"],
  "93": ["Loves to show off", "Dual nature person", "More hard work, less result", "Can be doctor, politician, leader"],
  "45": ["Needs to visit court/hospital", "Lives with restrictions", "Possibility of loss & jail", "Intelligent", "Court cases / hospital / FIR"],
  "54": ["Needs to visit court/hospital", "Lives with restrictions", "Possibility of loss & jail", "Intelligent", "Court cases / hospital / FIR"],
  "46": ["Skin problem / UTI problem", "Extra-marital relationship risk", "Inter-caste marriage", "Problem in conceiving", "Dual marriage possibility"],
  "64": ["Skin problem / UTI problem", "Extra-marital relationship risk", "Inter-caste marriage", "Problem in conceiving", "Dual marriage possibility"],
  "47": ["Honest person", "Jugaadu (resourceful)", "Brilliant mind"],
  "74": ["Honest person", "Jugaadu (resourceful)", "Brilliant mind"],
  "48": ["Incurable problems", "Marriage difficulties", "Blood disease — sudden problem", "Unexpected accidents", "Beware of fire", "Stay away from bad habits", "Maximum cancer cases"],
  "84": ["Incurable problems", "Marriage difficulties", "Blood disease — sudden problem", "Unexpected accidents", "Beware of fire", "Stay away from bad habits", "Maximum cancer cases"],
  "49": ["Does risky work", "Uniform work (Khaki)", "Criminal-minded / extremely naughty", "Earn money after hard work"],
  "94": ["Does risky work", "Uniform work (Khaki)", "Criminal-minded / extremely naughty", "Earn money after hard work"],
  "56": ["Hesitates in asking for own money", "Home near a big landmark", "Business-minded with good ideas", "Problems completing higher education"],
  "65": ["Hesitates in asking for own money", "Home near a big landmark", "Business-minded with good ideas", "Problems completing higher education"],
  "57": ["Speaker, writer", "Public relations", "Good expressive person", "Many people seek advice from them", "Good relations with influential people"],
  "75": ["Speaker, writer", "Public relations", "Good expressive person", "Many people seek advice from them", "Good relations with influential people"],
  "58": ["Money gets stuck", "Calculated mind", "Talks about lakhs and crores — dreams big", "Can destroy relationships through bad speech"],
  "85": ["Money gets stuck", "Calculated mind", "Talks about lakhs and crores — dreams big", "Can destroy relationships through bad speech"],
  "59": ["Can destroy relations through bad speech", "Research-oriented — many doctors/scientists"],
  "95": ["Can destroy relations through bad speech", "Research-oriented — many doctors/scientists"],
  "67": ["Chances of love marriage", "Issues in spouse health", "Disturbed married life possible", "Remarriage possibility", "Musical lover", "Will have music instrument at home"],
  "76": ["Chances of love marriage", "Issues in spouse health", "Disturbed married life possible", "Remarriage possibility", "Musical lover", "Will have music instrument at home"],
  "68": ["Eye problem", "Issues in one organ", "Major surgery possibility", "Married life disturbed"],
  "86": ["Eye problem", "Issues in one organ", "Major surgery possibility", "Married life disturbed"],
  "69": ["Good management skill", "Good planner", "Opposite sex involvement"],
  "96": ["Good management skill", "Good planner", "Opposite sex involvement"],
  "78": ["Healer", "Depressed / idealistic", "Solves problems by own power", "Works according to rules", "Stay away from bad habits", "Should do meditation", "Has more expectations"],
  "87": ["Healer", "Depressed / idealistic", "Solves problems by own power", "Works according to rules", "Stay away from bad habits", "Should do meditation", "Has more expectations"],
  "79": ["Success after separation from father", "Good knowledge"],
  "97": ["Success after separation from father", "Good knowledge"],
  "89": ["Argumentative", "Works with principles", "Chronic issue in later life", "Can be lawyer", "Iron deficiency"],
  "98": ["Argumentative", "Works with principles", "Chronic issue in later life", "Can be lawyer", "Iron deficiency"],
};

// ─── Repetition readings for mobile numbers ──────────────────────────────────
export const REPETITION_EFFECTS: Record<number, { double: string[]; triple: string[] }> = {
  1: { double: ["Very strong ego and leadership drive", "May face authority clashes"], triple: ["Extreme dominance, dictatorship tendency", "Massive ego issues"] },
  2: { double: ["Over-emotional", "Strong intuition but mood swings"], triple: ["Extreme emotional turbulence", "Highly psychic but unstable"] },
  3: { double: ["Excellent knowledge & wisdom", "Strong advisory skills"], triple: ["Over-confident in knowledge", "May become preachy"] },
  4: { double: ["Excessive hard work with less reward", "Legal issues may increase"], triple: ["Severe obstacles and delays", "Chronic health problems possible"] },
  5: { double: ["Excellent communication & business acumen", "May become restless"], triple: ["Extreme restlessness", "Scattered energy, commitment issues"] },
  6: { double: ["Strong love life & luxury", "May attract multiple relationships"], triple: ["Obsession with luxury", "Multiple relationship complications"] },
  7: { double: ["Deep spiritual inclination", "Strong healing ability"], triple: ["Extreme isolation tendency", "May become disconnected from reality"] },
  8: { double: ["Heavy karmic load", "Financial ups and downs"], triple: ["Severe karmic challenges", "Major health and legal issues"] },
  9: { double: ["Very energetic and aggressive", "Strong leadership in action"], triple: ["Extreme aggression", "Accident prone, anger management needed"] },
};

// ─── Analysis Interfaces ─────────────────────────────────────────────────────
export interface MobileAnalysis {
  mobileNumber: string;
  dob: string;
  moolank: number;
  bhagyank: number;
  grid: LoShuGrid;
  missingNumbers: number[];
  mobileDigits: number[];
  mobileTotal: number;
  mobileTotalSingle: number;
  digitPairs: string[];
  pairReadings: { pair: string; readings: string[] }[];
  repetitions: { digit: number; count: number; effects: string[] }[];
  friendshipAnalysis: {
    moolankFriendly: number[];
    moolankEnemy: number[];
    moolankNeutral: number[];
    bhagyankFriendly: number[];
    bhagyankEnemy: number[];
    bhagyankNeutral: number[];
  };
  totalCompatibility: "beneficial" | "neutral" | "malefic";
  totalAttributes: { keywords: string[]; areas: string[] };
  recommendations: string[];
  idealTotals: number[];
  warnings: string[];
  overallScore: number; // 0-100
}

// ─── Core Analysis Function ──────────────────────────────────────────────────
export function analyzeMobileNumber(mobileNumber: string, dob: string): MobileAnalysis {
  const cleanMobile = mobileNumber.replace(/\D/g, "");
  const moolank = calcMoolank(dob);
  const bhagyank = calcBhagyank(dob);
  const digits = extractDigits(dob);
  const grid = buildGrid(digits);
  const missingNumbers = grid.missing;

  // Mobile digits (only non-zero)
  const mobileDigits = cleanMobile.split("").map(Number).filter(d => d !== 0);
  const mobileTotal = mobileDigits.reduce((a, b) => a + b, 0);
  const mobileTotalSingle = reduce(mobileTotal);

  // Extract consecutive digit pairs from mobile
  const digitPairs: string[] = [];
  for (let i = 0; i < cleanMobile.length - 1; i++) {
    const pair = cleanMobile[i] + cleanMobile[i + 1];
    if (pair[0] !== "0" && pair[1] !== "0") {
      digitPairs.push(pair);
    }
  }

  // Pair readings
  const pairReadings = digitPairs
    .filter(p => COMBO_READINGS[p])
    .reduce((acc: { pair: string; readings: string[] }[], p) => {
      if (!acc.find(a => a.pair === p)) {
        acc.push({ pair: p, readings: COMBO_READINGS[p] });
      }
      return acc;
    }, []);

  // Repetitions
  const digitCounts: Record<number, number> = {};
  for (const d of mobileDigits) {
    digitCounts[d] = (digitCounts[d] || 0) + 1;
  }
  const repetitions = Object.entries(digitCounts)
    .filter(([, count]) => count >= 2)
    .map(([digit, count]) => {
      const d = Number(digit);
      const effects = count >= 3
        ? REPETITION_EFFECTS[d]?.triple || []
        : REPETITION_EFFECTS[d]?.double || [];
      return { digit: d, count, effects };
    });

  // Friendship analysis
  const moolankChart = FRIENDSHIP_CHART[moolank] || { friendly: [], enemy: [], neutral: [] };
  const bhagyankChart = FRIENDSHIP_CHART[bhagyank] || { friendly: [], enemy: [], neutral: [] };

  // Total compatibility
  let totalCompatibility: "beneficial" | "neutral" | "malefic" = "neutral";
  if (BENEFICIAL_TOTALS.includes(mobileTotalSingle)) totalCompatibility = "beneficial";
  else if (MALEFIC_TOTALS.includes(mobileTotalSingle)) totalCompatibility = "malefic";

  const totalAttributes = NUMBER_ATTRIBUTES[mobileTotalSingle] || { keywords: [], areas: [] };

  // Generate recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];

  // Step 1: Check if total is enemy to moolank or bhagyank
  if (moolankChart.enemy.includes(mobileTotalSingle)) {
    warnings.push(`Mobile total ${mobileTotalSingle} is ENEMY to your Moolank ${moolank}. This may cause conflicts.`);
  }
  if (bhagyankChart.enemy.includes(mobileTotalSingle)) {
    warnings.push(`Mobile total ${mobileTotalSingle} is ENEMY to your Bhagyank ${bhagyank}. This may hinder your destiny path.`);
  }

  // Step 2: Check for malefic individual digits (4, 7, 8)
  const maleficInMobile = mobileDigits.filter(d => [4, 7, 8].includes(d));
  if (maleficInMobile.length > 0) {
    warnings.push(`Your mobile contains malefic number(s): ${[...new Set(maleficInMobile)].join(", ")}. Try to minimize 4, 7, 8 unless specifically needed.`);
  }

  // Step 3: Check malefic total
  if (MALEFIC_TOTALS.includes(mobileTotalSingle)) {
    warnings.push(`Mobile total ${mobileTotalSingle} is a malefic number. Preferred totals are 1, 3, 5, or 6.`);
  }

  // Step 4: Generate ideal totals
  const idealTotals = BENEFICIAL_TOTALS.filter(t => {
    return !moolankChart.enemy.includes(t) && !bhagyankChart.enemy.includes(t);
  });

  // Step 5: Prioritize missing numbers from DOB that are beneficial
  const missingBeneficial = missingNumbers.filter(n => BENEFICIAL_TOTALS.includes(n));
  if (missingBeneficial.length > 0) {
    recommendations.push(`From your missing numbers, ${missingBeneficial.join(", ")} are beneficial. Consider these as your mobile total for maximum benefit.`);
  }

  // Step 6: Friendly total recommendation
  const friendlyBeneficial = idealTotals.filter(t =>
    moolankChart.friendly.includes(t) || bhagyankChart.friendly.includes(t)
  );
  if (friendlyBeneficial.length > 0) {
    recommendations.push(`Best mobile totals for you: ${friendlyBeneficial.join(", ")} — these are both beneficial and friendly to your birth/destiny numbers.`);
  }

  // Step 7: Attribute-based recommendation
  if (totalCompatibility === "beneficial") {
    recommendations.push(`Your current mobile total ${mobileTotalSingle} is beneficial! It supports: ${totalAttributes.areas.slice(0, 3).join(", ")}.`);
  }

  // Step 8: Specific number attribute advice
  for (const t of idealTotals) {
    const attr = NUMBER_ATTRIBUTES[t];
    if (attr) {
      recommendations.push(`Total ${t} brings: ${attr.areas.slice(0, 3).join(", ")}.`);
    }
  }

  // Overall score calculation
  let score = 50; // base
  if (totalCompatibility === "beneficial") score += 20;
  else if (totalCompatibility === "malefic") score -= 20;

  if (moolankChart.friendly.includes(mobileTotalSingle)) score += 15;
  else if (moolankChart.enemy.includes(mobileTotalSingle)) score -= 15;

  if (bhagyankChart.friendly.includes(mobileTotalSingle)) score += 15;
  else if (bhagyankChart.enemy.includes(mobileTotalSingle)) score -= 15;

  // Penalize malefic individual digits
  score -= maleficInMobile.length * 3;

  // Bonus for missing number coverage
  const coveredMissing = missingNumbers.filter(n => mobileDigits.includes(n));
  score += coveredMissing.length * 5;

  // Clamp
  score = Math.max(5, Math.min(100, score));

  return {
    mobileNumber: cleanMobile,
    dob,
    moolank,
    bhagyank,
    grid,
    missingNumbers,
    mobileDigits,
    mobileTotal,
    mobileTotalSingle,
    digitPairs,
    pairReadings,
    repetitions,
    friendshipAnalysis: {
      moolankFriendly: moolankChart.friendly,
      moolankEnemy: moolankChart.enemy,
      moolankNeutral: moolankChart.neutral,
      bhagyankFriendly: bhagyankChart.friendly,
      bhagyankEnemy: bhagyankChart.enemy,
      bhagyankNeutral: bhagyankChart.neutral,
    },
    totalCompatibility,
    totalAttributes,
    recommendations,
    idealTotals,
    warnings,
    overallScore: score,
  };
}