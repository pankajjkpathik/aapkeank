// ─── Lal Kitab Predictions & Remedies Engine ────────────────────────────────
// Based on the Lal Kitab fixed-house system using numerology (Moolank/Bhagyank)
import { reduce, calcMoolank, calcBhagyank } from "./numerology";

// ─── Planet ↔ Number mapping (Vedic Numerology) ────────────────────────────
export const PLANET_NUMBER: Record<number, string> = {
  1: "Sun (Surya)",
  2: "Moon (Chandra)",
  3: "Jupiter (Guru)",
  4: "Rahu",
  5: "Mercury (Budh)",
  6: "Venus (Shukra)",
  7: "Ketu",
  8: "Saturn (Shani)",
  9: "Mars (Mangal)",
};

export const PLANET_ICON: Record<number, string> = {
  1: "☉", 2: "☽", 3: "♃", 4: "☊", 5: "☿", 6: "♀", 7: "☋", 8: "♄", 9: "♂",
};

// ─── House Significations ───────────────────────────────────────────────────
export const HOUSE_SIGNIFICATION: Record<number, string> = {
  1: "Self, Personality, Health & Confidence",
  2: "Family, Wealth, Speech & Food Habits",
  3: "Siblings, Courage, Short Travels & Communication",
  4: "Mother, Property, Vehicles & Inner Peace",
  5: "Children, Education, Romance & Intelligence",
  6: "Enemies, Diseases, Debts & Service",
  7: "Marriage, Partnerships & Business Relations",
  8: "Longevity, Obstacles, Inheritance & Transformation",
  9: "Luck, Father, Religion & Long Journeys",
  10: "Career, Profession, Karma & Public Image",
  11: "Income, Gains, Friends & Aspirations",
  12: "Expenses, Losses, Foreign Travel & Spiritual Liberation",
};

// ─── Lal Kitab Remedies for each Planet in each House ───────────────────────
export const LAL_KITAB_REMEDIES: Record<number, Record<number, string[]>> = {
  // Sun (1) in houses 1-12
  1: {
    1: [
      "Get married before the age of 24",
      "Do not have sex during the day time",
      "Either one of the spouses must stop eating jaggery",
      "Build a small dark vastu room towards the left side at the end of your house",
      "Set-up a hand pump for water in your ancestral house",
    ],
    2: [
      "Do not accept donations that are white in colour, especially rice, silver & milk",
      "Avoid discords related to ladies, wealth & property at all costs",
      "Consistently donate almonds, coconuts and mustard oil to places of worship",
    ],
    3: [
      "Make efforts to keep your mother happy and always seek her blessings",
      "Do not get involved in any evil deeds and practise good ethical behaviour",
      "Make food with rice or milk and serve it to others",
      "Take whole green gram in a pouch and feed birds the next morning",
    ],
    4: [
      "Businesses related to textiles, gold and silver will give promising results",
      "Businesses associated with iron and wood should never be taken up",
      "Be generous in distributing alms and food to needy people",
    ],
    5: [
      "Have a child as early as possible, do not delay",
      "Ensure to build the kitchen in the eastern portion of the house",
      "Drop a small quantity of mustard oil on the floor of your house for 43 days",
      "Serve monkeys, especially the red mouthed ones",
    ],
    6: [
      "Strictly follow your family and traditional customs",
      "Avoid constructing underground furnaces in the house",
      "After dinner, sprinkle milk on the kitchen stove fire",
      "Keep Gangajal in the house",
      "Offer jaggery or wheat to monkeys",
    ],
    7: [
      "Start work only after taking some sweets with water",
      "Offer a small piece of chapati to the kitchen stove fire before meals",
      "Rear a black cow or serve one without horns",
      "Take 7 squared pieces of Copper and bury them under grass",
      "Keep sipping water while you work",
    ],
    8: [
      "Never store plain white cloth in the house",
      "Do not opt to live in south facing houses",
      "Eat something sweet and drink water before commencing work",
      "Offer copper coins into a burning pyre whenever possible",
      "Donate 800g jaggery in a temple for 8 consecutive days",
    ],
    9: [
      "Should never accept any silver items as a gift or donation",
      "Donate silver articles whenever possible",
      "Do not take rice, milk or white coloured food items as gifts",
      "Do not sell ancestral artefacts, especially brass utensils",
      "Maintain balance in nature - never be too soft or too angry",
    ],
    10: [
      "Apply saffron tilak daily",
      "Put a copper coin in water overnight and drink that water next morning for 43 days",
      "Donate almonds to religious places",
      "Stay away from consumption of liquor and meat",
      "Offer a copper coin to a river for 43 consecutive days",
    ],
    11: [
      "Do not consume alcohol and non-vegetarian food",
      "Keep almonds or radishes near the head of the bed and offer in temple for 43 days",
    ],
    12: [
      "Never give any false testaments at court",
      "Live in a well naturally lit house",
      "Should maintain a courtyard for the house",
      "Live a religious and spiritual life",
    ],
  },
  // Moon (2) in houses
  2: {
    1: [
      "Do not marry between 24-27 years of age",
      "Stay away from green colour and from sister-in-law",
      "Offer water to the roots of a banyan tree",
      "Insert copper nails in the four corners of the cot",
      "Keep a silver plate at home",
      "Use silver pots for drinking water or milk",
    ],
    2: [
      "Offer green-coloured clothes to small children for 43 days",
      "Place a small piece of silver in the foundation of the house",
      "Have one space in the house where the floor is not cemented",
      "Should not keep shivling photo at home",
    ],
    3: [
      "Donate things associated with Moon (silver, rice) after a daughter's birth",
      "Donate things associated with Sun (wheat, jaggery) after a son's birth",
      "Offer milk in place of water to guests",
      "Worship Goddess Durga and do kanya pujan",
    ],
    4: [
      "Donate milk regularly",
      "Do not make khoya at home or sell milk/khoya",
      "Before starting any auspicious work, fill and place a pot of milk at home",
      "Do not frivolously flirt or commit adultery",
    ],
    5: [
      "Control your tongue and never use abusive language",
      "Avoid being greedy and selfish",
      "Doing good public service will enhance income and reputation",
      "Donate rock sugar (dhaage waali mishri) and rice",
    ],
    6: [
      "Do good public service",
      "Keep rabbits as pets",
      "Serve milk to your father with your own hands",
      "Do not consume milk at night but can take during daytime",
    ],
    7: [
      "Donate milk but do not sell for profits",
      "Do Shiv Pujan",
      "Avoid marriage in the 24th year of life",
      "Do not make khoya at home",
      "Keep your mother happy",
    ],
    8: [
      "Must avoid gambling and flirting",
      "Perform shrardh ceremony for ancestors",
      "On amavasya, donate kheer on behalf of the ancestors",
      "Obtain blessings of old men and children by touching their feet",
    ],
    9: [
      "Keep a square piece of silver in the cupboard locker",
      "Serve labour class with milk",
      "Offer milk to snakes",
      "Feed rice to fish",
    ],
    10: [
      "Visit religious places of worship and pray with reverence",
      "Avoid consumption of milk or rice at night",
      "Hammer silver nails on the 4 legs of the cot",
      "Keep a gold brick in the room",
      "Abstain from eating non-veg, drinking liquor and committing adultery",
    ],
    11: [
      "Offer milk in Bhairav temple",
      "Donate 11 times the milk that you consume",
      "Heat up a piece of gold on fire and put it in a glass of milk before drinking",
      "Throw 125 pieces of sweet white peda in a river",
    ],
    12: [
      "Wear gold earrings",
      "Drink milk after dunking a hot piece of gold into it",
      "Visit religious places to ward off evil effects",
      "Never offer milk or food to ascetics or sadhus",
    ],
  },
  // Jupiter (3) in houses
  3: {
    1: ["Orient towards education and gain knowledge", "Donate yellow-coloured clothes to holy men"],
    2: ["Invite guests home and treat them well", "Take chana daal in yellow cloth and offer to a priest"],
    3: ["Chant Durga Chalisa", "Do Kanya pujan"],
    4: ["Do not move about bare chested", "Do not keep broken toys in the house"],
    5: ["Be kind towards dogs and feed them vegetarian food", "Do Ganesh puja", "Do not eat from bhandaras but contribute money"],
    6: ["Be kind towards dogs and feed them", "Donate 600g chickpea lentils for 43 days in a temple"],
    7: ["Keep spiritual books in bedroom", "Worship Lord Shiva and offer water to Shivling", "Keep milk near head during bedtime"],
    8: ["Plant/offer water to banyan tree in cremation ground", "Offer ghee, potatoes and camphor to temples", "Wear gold all the time"],
    9: ["Do austerities for ancestors (pitr daan)", "Donate to the family priest", "Go to a temple every day"],
    10: ["Apply saffron tilak daily", "Put copper coin in water overnight and drink next morning for 43 days", "Donate almonds to religious places"],
    11: ["Wear a copper kada in your dominant hand", "Do not eat non-veg"],
    12: ["Wear gold", "Wear yellow colored thread around your neck"],
  },
  // Rahu (4) in houses
  4: {
    1: ["Wear silver in the neck", "Offer coconut in running water", "Never take electrical items from anyone for free"],
    2: ["Keep silver elephant in NW direction", "Frequent bath in Holy Ganga or keep Gangajal at home"],
    3: ["Never keep ivory things in house", "Never keep elephant teeth in the house"],
    4: ["Wear a silver chain or bracelet", "Drink water from a silver glass", "Keep silver elephant in steel bowl NW direction"],
    5: ["Do not get involved in adultery", "Remarry your wife after 2 years", "Drink water from a silver glass"],
    6: ["Keep dogs with black hair", "Drink water from a silver glass", "Keep silver elephant in steel bowl NW direction"],
    7: ["Keep dogs with black hair", "Drink water from a silver glass", "Keep silver elephant in steel bowl NW direction"],
    8: ["Offer 8kg raw coal to running water", "Give food to fish", "Keep Saunf under the pillow while sleeping"],
    9: ["Use saffron tilak", "Wear Gold", "Always keep a Dog"],
    10: ["Cover your head", "Feed blind people"],
    11: ["Silver glass for drinking water", "Do not take gifts from anyone"],
    12: ["Take one meal in the Kitchen", "Drink water in silver Glass"],
  },
  // Mercury (5) in houses
  5: {
    1: ["Avoid all things green", "Do not live with sister-in-law", "Avoid non-veg and liquor"],
    2: ["Abstain from eating non-veg and drinking liquor", "Can wear silver nose piercing for 96 days then offer in running water"],
    3: ["Clean teeth with alum everyday", "Feed birds with whole green gram", "Do not keep musical instruments"],
    4: ["Wear solid silver chain for mental peace", "Apply kesar tilak for 43 days", "Offer jaggery to monkeys"],
    5: ["Should not wear trousers without a belt", "Wear a copper coin in white thread", "Serve cows for good luck"],
    6: ["Bury a bottle of Gangajal in agricultural land", "Make spouse wear silver ring in left hand", "Eat food in bronze utensils"],
    7: ["Avoid business in partnership", "Avoid work related to speculation", "Serve and feed black cows"],
    8: ["Fill earthen pot with honey and bury in cremation ground", "Place milk on roof of house", "Take copper water pot with moong and offer in running water"],
    9: ["Avoid using green colour", "Get nose pierced", "Offer mushrooms in earthen pot to religious place for 43 days"],
    10: ["Avoid non-veg food and alcohol", "Offer rice and milk in religious places"],
    11: ["Wear copper coin in neck tied in white thread or silver chain"],
    12: ["Throw new empty mud pitcher in a river", "Wear stainless steel ring", "Apply kesar tilak", "Visit religious places"],
  },
  // Venus (6) in houses
  6: {
    1: ["Don't get married at 25 years of age", "Serve black cows", "Take bath applying curd on body every alternate day"],
    2: ["Do not engage in adultery", "Offer 2kg cow's ghee in temple", "Stay in a gaumukhi ghar (wider at back, narrower at front)"],
    3: ["Avoid playing too much music in the house", "Respect your spouse and never insult them"],
    4: ["Change wife's name after marriage", "Drop rice, silver and milk in running water", "Keep roof clean and well-maintained"],
    5: ["Do Kuber pooja and chant Kuber chalisa", "Do not marry against parents' wishes", "Serve cows and care for elderly women"],
    6: ["Wife should not dress like a male", "Must marry a person who has brothers", "Should not accept clothes as gifts"],
    7: ["Never domesticate white cows", "Serve red and black cows with devotion", "Throw blue flowers in dirty canal for 43 days"],
    8: ["Never accept donations of clothes", "Visit places of worship", "Throw copper coin or blue flower in gutter for 10 days"],
    9: ["Chant Mahalakshmi Ashtak", "Chant Shreem 108 times", "Keep Sri Yantra crystal at home", "Donate generously in cow shelter"],
    10: ["Wash private parts with curd", "Western wall of house should be of mud", "Complete abstinence from alcohol and non-veg"],
    11: ["Remedies related to Mercury will help", "Oil should be donated on Saturdays"],
    12: ["Wife should flush blue flowers in gutter at sunset", "Wife should be involved in charity", "Love and honour your spouse"],
  },
  // Ketu (7) in houses
  7: {
    1: ["Do not give alms in morning and evening", "Feed jaggery to monkeys", "Apply saffron tilak", "Wear gold earrings"],
    2: ["Feed dogs", "Apply saffron or turmeric tilak", "Visit temples and bow reverently to deity"],
    3: ["Apply saffron tilak", "Donate chane ki dal or turmeric for 43 days", "Wear gold for financial stability"],
    4: ["Keep a dog at home", "Wear gold earrings", "Wear silver for peace of mind", "Offer yellow things in flowing water"],
    5: ["Donate milk and sugar", "Do remedies for Jupiter"],
    6: ["Wear a golden ring in left hand", "Drink milk with saffron", "Keep a pure black dog at home"],
    7: ["Never make false promises", "Apply saffron tilak", "Do remedies of Jupiter for serious troubles"],
    8: ["Keep a dog at home", "Donate black and white blanket in temple", "Worship Lord Ganesha", "Wear gold earrings"],
    9: ["Keep a black dog at home", "Keep rectangular bricks of gold", "Respect elders, especially father-in-law"],
    10: ["Keep silver pot with honey in West direction", "Keep a dog after age 48", "Follow Moon and Jupiter remedies"],
    11: ["Keep a black dog", "Wear onyx or emerald stone", "Keep mauli thread under pillow and donate to temple for 43 days"],
    12: ["Wear wedding rings", "Worship Lord Ganesha", "Foster a dog at home", "Keep saunf and khand under pillow"],
  },
  // Saturn (8) in houses
  8: {
    1: ["Take care of hair for rectifying ill-effects of Shani", "Must not consume alcohol and non-veg", "Serve monkeys for prosperity", "Offer sweet milk to roots of banyan tree"],
    2: ["Mend eating habits, directly affects money", "Go to temple barefoot for 43 days", "Apply tilak of curd or milk", "Offer milk to snakes"],
    3: ["Make time for short travels", "House shouldn't have South or East entrance", "Serve and feed dogs", "Have a dark room in the house"],
    4: ["Take extra care of mother's health", "Start taking homoeopathic medicines", "Offer milk to snakes", "Pour milk in well for 43 days"],
    5: ["Do not eat too many sweets", "Distribute salty things on son's birthday", "Offer almonds in temple for 43 days", "Pour Surma in running water for 43 days"],
    6: ["Take care of a black dog", "Visit court every 3 months during Saturn dasha", "Stay away from leather products"],
    7: ["Accept your spouse and be disciplined", "Bury a flute filled with sugar in deserted place", "Serve and feed black cows", "Keep honey in mud pots at home"],
    8: ["Spouse should learn astrology", "Keep square piece of silver in home locker", "Bath with milk or add milk to bath water", "Float black lentils in running water"],
    9: ["Accept and follow traditions of your house", "Get involved in religious activities", "Offer rice or almonds in running water"],
    10: ["Go to temple regularly", "Do not consume alcohol, eggs or meat", "Offer food to 10 blind people"],
    11: ["Have cordial relationships even with unruly friends", "Maintain good moral character", "Do not drink alcohol"],
    12: ["Be mindful of expenditure, protect wealth", "Start a SIP investment", "Do meditation", "Keep fennel seeds under pillow"],
  },
  // Mars (9) in houses
  9: {
    1: ["Should not accept anything free or in charity", "Must avoid telling lies", "Avoid keeping things made of ivory"],
    2: ["Do activities to strengthen Moon (textile business)", "Make in-laws arrange drinking water facilities", "Donate yellow sweet rice"],
    3: ["Be softhearted and good to brothers", "Keep ivory items at home", "Wear silver ring or bangle in left hand"],
    4: ["Offer sweet milk to roots of banyan tree and apply tilak from wet soil", "Place empty sugar bags on roof", "Keep square piece of silver"],
    5: ["Maintain good moral character", "Keep water pot below head of bed, pour in flowerpot next morning", "Plant a neem tree and offer water to it"],
    6: ["Distribute salty food items when male child is born", "Chant Ganesh mantra", "Do Saturn's remedies for family comfort"],
    7: ["Place a solid piece of silver in house", "Offer sweets to daughters, sisters and widows", "Offer sweet halwa to Vishnu ji"],
    8: ["Take blessings from widows", "Wear a silver chain", "Offer sweet flatbreads to dogs for 43 days using jaggery"],
    9: ["Obey elder brothers", "Render services to elder brother's wife", "Offer rice, milk and jaggery at worship places for 43 days"],
    10: ["Keep a brass deer in West side of house", "Do not sell ancestral property or inherited gold", "Offer help to one-eyed and childless people"],
    11: ["Never sell ancestral property", "Keep red vermilion or honey in earthen pot at home"],
    12: ["Take honey first thing in the morning", "Consuming and offering sweets will increase wealth"],
  },
};

// ─── Planet → Pakka House (natural house of each planet) ────────────────────
export const PAKKA_HOUSE: Record<number, number> = {
  1: 1,  // Sun → 1st
  2: 4,  // Moon → 4th
  3: 9,  // Jupiter → 9th
  4: 6,  // Rahu → 6th
  5: 7,  // Mercury → 7th
  6: 7,  // Venus → 7th
  7: 12, // Ketu → 12th
  8: 10, // Saturn → 10th
  9: 3,  // Mars → 3rd
};

// ─── Friendly/Enemy Planets ─────────────────────────────────────────────────
export const PLANET_FRIENDS: Record<number, number[]> = {
  1: [2, 3, 9], 2: [1, 5], 3: [1, 2, 9], 4: [5, 6, 8],
  5: [1, 6], 6: [5, 8], 7: [3, 6, 9], 8: [5, 6, 4],
  9: [1, 2, 3],
};

export const PLANET_ENEMIES: Record<number, number[]> = {
  1: [6, 8], 2: [4, 7], 3: [5, 4], 4: [1, 2, 9],
  5: [2], 6: [1, 2], 7: [1, 2], 8: [1, 2, 9],
  9: [5, 4],
};

// ─── Analysis Types ─────────────────────────────────────────────────────────
export interface LalKitabPlanet {
  planet: number;
  planetName: string;
  icon: string;
  house: number;
  houseSignification: string;
  isInPakkaHouse: boolean;
  isFriendlyHouse: boolean;
  isEnemyHouse: boolean;
  remedies: string[];
  prediction: string;
}

export interface LalKitabAnalysis {
  name: string;
  dob: string;
  moolank: number;
  bhagyank: number;
  moolankPlanet: string;
  bhagyankPlanet: string;
  planets: LalKitabPlanet[];
  generalRemedies: string[];
  overallOutlook: string;
}

// ─── Core Analysis Function ─────────────────────────────────────────────────
export function analyzeLalKitab(name: string, dob: string): LalKitabAnalysis {
  const moolank = calcMoolank(dob);
  const bhagyank = calcBhagyank(dob);

  // In Lal Kitab simplified numerology approach, we map numbers to houses
  // Moolank → primary planet, Bhagyank → destiny planet
  // We analyze key planets based on the person's DOB digits
  const dobDigits = dob.replace(/\D/g, "").split("").map(Number).filter(d => d > 0 && d <= 9);
  const uniqueDigits = [...new Set([moolank, bhagyank, ...dobDigits])].filter(d => d >= 1 && d <= 9);

  const planets: LalKitabPlanet[] = uniqueDigits.map(digit => {
    // Map the digit to a house based on Lal Kitab principles
    // Use a deterministic mapping: planet number → its assigned house for this person
    const house = assignHouse(digit, moolank, bhagyank);
    const pkHouse = PAKKA_HOUSE[digit];
    const houseOwner = getHouseOwner(house);
    const isFriendly = (PLANET_FRIENDS[digit] || []).includes(houseOwner);
    const isEnemy = (PLANET_ENEMIES[digit] || []).includes(houseOwner);
    const remedies = (LAL_KITAB_REMEDIES[digit] && LAL_KITAB_REMEDIES[digit][house]) || [];

    const prediction = generatePrediction(digit, house, pkHouse === house, isFriendly, isEnemy);

    return {
      planet: digit,
      planetName: PLANET_NUMBER[digit] || `Planet ${digit}`,
      icon: PLANET_ICON[digit] || "✦",
      house,
      houseSignification: HOUSE_SIGNIFICATION[house] || "",
      isInPakkaHouse: pkHouse === house,
      isFriendlyHouse: isFriendly,
      isEnemyHouse: isEnemy,
      remedies,
      prediction,
    };
  });

  const generalRemedies = [
    `As your Moolank is ${moolank} (${PLANET_NUMBER[moolank]}), strengthen this planet through its remedies`,
    `Bhagyank ${bhagyank} (${PLANET_NUMBER[bhagyank]}) guides your destiny - follow remedies for this planet in its placed house`,
    "Keep Gangajal in the house for overall purification",
    "Donate to the needy and visit temples regularly",
    "Respect elders and seek blessings from parents",
  ];

  const positiveCount = planets.filter(p => p.isInPakkaHouse || p.isFriendlyHouse).length;
  const negativeCount = planets.filter(p => p.isEnemyHouse).length;

  const overallOutlook = positiveCount > negativeCount
    ? "Your Lal Kitab chart shows favorable placements. Most planets are in supportive positions. Following the suggested remedies will further enhance positive outcomes."
    : positiveCount === negativeCount
    ? "Your chart shows a balanced mix of favorable and challenging placements. Consistent remedy practice will help neutralize negative influences."
    : "Your chart indicates some planetary challenges. Diligent practice of the recommended remedies is strongly advised to overcome obstacles and invite prosperity.";

  return {
    name, dob, moolank, bhagyank,
    moolankPlanet: PLANET_NUMBER[moolank],
    bhagyankPlanet: PLANET_NUMBER[bhagyank],
    planets,
    generalRemedies,
    overallOutlook,
  };
}

// ─── Helper: Assign house for a planet based on Lal Kitab ───────────────────
function assignHouse(planet: number, moolank: number, bhagyank: number): number {
  // Lal Kitab uses fixed house system based on Kaal Purush Kundali
  // For numerology-based analysis, we derive house from the relationship
  // between the planet number and the birth numbers
  if (planet === moolank) return 1; // Moolank planet sits in 1st (self)
  if (planet === bhagyank) return 9; // Bhagyank planet sits in 9th (fortune)

  // For other planets, distribute based on relationship
  const sum = (planet + moolank) % 12;
  return sum === 0 ? 12 : sum;
}

// ─── Helper: Get natural house owner ────────────────────────────────────────
function getHouseOwner(house: number): number {
  const owners: Record<number, number> = {
    1: 9, 2: 6, 3: 5, 4: 2, 5: 1, 6: 5,
    7: 6, 8: 9, 9: 3, 10: 8, 11: 8, 12: 3,
  };
  return owners[house] || 1;
}

// ─── Helper: Generate prediction text ───────────────────────────────────────
function generatePrediction(planet: number, house: number, isPakka: boolean, isFriendly: boolean, isEnemy: boolean): string {
  const pName = PLANET_NUMBER[planet];
  const hSig = HOUSE_SIGNIFICATION[house];

  if (isPakka) {
    return `${pName} is in its Pakka (permanent) house — House ${house}. This is an extremely powerful and auspicious placement. The planet's full potential is realized here, bringing strong positive results in the area of ${hSig}.`;
  }
  if (isFriendly) {
    return `${pName} is placed in House ${house} (${hSig}) in a friendly sign. This creates favorable conditions. The planet will give good results, though some remedies can further enhance the positive effects.`;
  }
  if (isEnemy) {
    return `${pName} is placed in House ${house} (${hSig}) in an unfriendly position. This may create challenges in the related life areas. Following the Lal Kitab remedies below is strongly recommended to neutralize negative effects.`;
  }
  return `${pName} is placed in House ${house} (${hSig}) in a neutral position. Results will be moderate. The remedies below can help strengthen this planet's positive influence in your life.`;
}
