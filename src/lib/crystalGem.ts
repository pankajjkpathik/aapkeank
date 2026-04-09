// ─── Crystal, Gem & Rudraksha Suggestion Engine ─────────────────────────────
import { calcMoolank, calcBhagyank } from "./numerology";

export interface CrystalInfo {
  name: string;
  color: string;
  planet: string;
  chakra: string;
  properties: string;
}

export interface RudrakshaInfo {
  mukhi: number;
  deity: string;
  benefits: string;
  mantra: string;
}

export interface GemSuggestion {
  name: string;
  purpose: string;
}

export interface CrystalAnalysis {
  clientName: string;
  dob: string;
  moolank: number;
  bhagyank: number;
  moolankPlanet: string;
  bhagyankPlanet: string;
  moolankCrystals: CrystalInfo[];
  bhagyankCrystals: CrystalInfo[];
  moolankBracelet: string;
  bhagyankBracelet: string;
  rudraksha: RudrakshaInfo[];
  gems: GemSuggestion[];
  combinations: { purpose: string; crystals: string; effect: string }[];
  chakraSuggestions: { chakra: string; crystals: string[] }[];
}

const PLANET_NAME: Record<number, string> = {
  1:"Sun",2:"Moon",3:"Jupiter",4:"Rahu",5:"Mercury",6:"Venus",7:"Ketu",8:"Saturn",9:"Mars",
};

// Crystals by ruling planet number
const CRYSTALS_BY_PLANET: Record<number, CrystalInfo[]> = {
  1: [
    { name:"Sunstone", color:"Reddish Orange", planet:"Sun", chakra:"Sacral", properties:"Induces courage, mental stability, mental peace and maturity, fosters balance" },
    { name:"Red Jasper", color:"Red", planet:"Sun", chakra:"Root", properties:"Brings balance, stamina, courage, inner strength, tranquility, grounding" },
  ],
  2: [
    { name:"Moonstone", color:"White/Rainbow", planet:"Moon", chakra:"Third Eye & Crown", properties:"Promotes emotional balance, reduces anxiety, intuition, stone of intuition" },
    { name:"Mother of Pearl", color:"White to Silver", planet:"Moon", chakra:"Solar Plexus & Throat", properties:"Protection, inner peace, prosperity, motherly protection, increased psychic powers" },
    { name:"Selenite", color:"White with gold hues", planet:"Moon", chakra:"Third Eye & Crown", properties:"Liquid Light — promotes peace, calm, mental clarity and well-being" },
  ],
  3: [
    { name:"Citrine", color:"Yellow", planet:"Jupiter", chakra:"Solar Plexus", properties:"Merchant's Stone — good fortune, prosperity, success, optimism" },
    { name:"Yellow Aventurine", color:"Yellow", planet:"Jupiter", chakra:"Solar Plexus", properties:"Increases concentration, memory power and self confidence" },
    { name:"Topaz", color:"Golden/Blue", planet:"Jupiter", chakra:"Throat", properties:"Induces harmony, self expression, creativity and intuition" },
  ],
  4: [
    { name:"Hessonite (Gomed)", color:"Honey Brown", planet:"Rahu", chakra:"Root", properties:"Removes confusion, provides clarity, protects from Rahu's negative effects" },
    { name:"Garnet", color:"Red", planet:"Rahu", chakra:"Root & Sacral", properties:"Protection against disasters, evil spirits and mental insanity" },
  ],
  5: [
    { name:"Green Aventurine", color:"Green", planet:"Mercury", chakra:"Heart", properties:"Stone of Opportunity — emotional healing, communication, prosperity, reduces anger" },
    { name:"Green Jade", color:"Deep Green", planet:"Mercury", chakra:"Heart", properties:"Promotes compassion, harmony, attracts abundance, purity and calmness" },
    { name:"Flourite", color:"Multi-color", planet:"Mercury", chakra:"Heart", properties:"Increases awareness, clarity, improves intuition and reduces stress" },
  ],
  6: [
    { name:"Rose Quartz", color:"Pink", planet:"Venus", chakra:"Heart", properties:"Attracts love, stability, kindness, health, prosperity, unconditional love" },
    { name:"Opalite", color:"Milky/Iridescent", planet:"Venus", chakra:"Heart", properties:"Enhances psychic abilities, induces visions, aids communication" },
    { name:"Rhodonite", color:"Pink/Rose Red", planet:"Venus", chakra:"Heart", properties:"Stone of Love — emotional balance and mental focus" },
    { name:"Labradorite", color:"Blue/Green/Gold", planet:"Venus", chakra:"Throat & Third Eye", properties:"Stone of Magic — awakens mystical abilities, clears aura, protects against negativity" },
  ],
  7: [
    { name:"Cat's Eye", color:"Green/Brown", planet:"Ketu", chakra:"Crown & Third Eye", properties:"Letting go, healing from trauma, spiritual heights, strengthens self worth" },
  ],
  8: [
    { name:"Amethyst", color:"Purple", planet:"Saturn", chakra:"Throat, Heart & Crown", properties:"Helps with anxiety, depression, clear mind, natural tranquilizer, spiritual energy" },
    { name:"Lapis Lazuli", color:"Royal Blue", planet:"Saturn", chakra:"Throat & Third Eye", properties:"Enhances communication, self-expression, emotional healing, protective stone" },
    { name:"Iolite", color:"Blue-Violet", planet:"Saturn", chakra:"Third Eye", properties:"Enhances psychic abilities and sharpens inner vision" },
  ],
  9: [
    { name:"Red Carnelian", color:"Red-Orange", planet:"Mars", chakra:"Root & Sacral", properties:"Stone of ambition — gives courage, motivation for success" },
    { name:"Pyrite", color:"Metallic Gold", planet:"Mars", chakra:"Sacral & Solar Plexus", properties:"Fool's Gold — attracts wealth, prosperity, empowerment" },
    { name:"Tiger's Eye", color:"Brown/Yellow", planet:"Mars", chakra:"Sacral & Solar Plexus", properties:"Enhances healing, protection, courage, insight" },
    { name:"Hematite", color:"Metallic Grey", planet:"Mars", chakra:"Root", properties:"Enhances grounding, self-confidence, willpower and self-esteem" },
  ],
};

const BRACELET_MOOLANK: Record<number, string> = {
  1:"Sunstone",2:"Mother of Pearl",3:"Dragon Vein Agate",4:"Golden Obsidian",
  5:"Green Aventurine",6:"Rose Quartz",7:"Cat's Eye",8:"Amethyst",9:"Pyrite",
};
const BRACELET_BHAGYANK: Record<number, string> = {
  1:"Tiger Eye",2:"Green Jade",3:"Azurite",4:"Rock Crystal",
  5:"Turquoise",6:"Rhodonite",7:"Kambaba Jasper",8:"Sodalite",9:"Bloodstone",
};

const RUDRAKSHA_DATA: Record<number, RudrakshaInfo> = {
  1:{mukhi:1,deity:"Lord Shiva",benefits:"Mental peace, concentration, spiritual growth",mantra:"Om Namah Shivaya"},
  2:{mukhi:2,deity:"Ardhanarishvara",benefits:"Harmony in relationships, emotional balance, unity",mantra:"Om Namah Shivaya"},
  3:{mukhi:3,deity:"Agni",benefits:"Relief from stress, self-confidence, physical health",mantra:"Om Kleem Namah"},
  4:{mukhi:4,deity:"Brahma",benefits:"Intellectual abilities, communication, creativity",mantra:"Om Hreem Namah"},
  5:{mukhi:5,deity:"Kalagni Rudra",benefits:"General well-being, peace, health (most common)",mantra:"Om Hreem Namah"},
  6:{mukhi:6,deity:"Kartikeya",benefits:"Willpower, focus, grounding, balance and harmony",mantra:"Om Hreem Hoom Namah"},
  7:{mukhi:7,deity:"Goddess Lakshmi",benefits:"Wealth, prosperity, overcoming financial challenges",mantra:"Om Hoom Namah"},
  8:{mukhi:8,deity:"Ganesha",benefits:"Removes obstacles, success, enhanced intellect",mantra:"Om Gam Ganapataye Namah"},
  9:{mukhi:9,deity:"Durga Devi",benefits:"Protection from negativity, fearlessness, spiritual growth",mantra:"Om Hreem Hoom Namah"},
};

const COMBINATIONS = [
  {purpose:"Financial Abundance",crystals:"Citrine + Pyrite",effect:"Boosts financial opportunities, manifests wealth, protects against losses"},
  {purpose:"Relationship Healing",crystals:"Rose Quartz + Rhodonite",effect:"Heals past trauma, fosters empathy, encourages open communication"},
  {purpose:"Protection",crystals:"Black Tourmaline + Amethyst + Selenite",effect:"Powerful shield against negativity, purifies energy field"},
  {purpose:"Career Success",crystals:"Tiger's Eye + Carnelian",effect:"Strengthens confidence, strategic thinking, motivates decisive action"},
  {purpose:"Inner Peace",crystals:"Amethyst + Clear Quartz",effect:"Emotional healing, improves communication, amplifies positive energy"},
  {purpose:"Prosperity",crystals:"Green Aventurine + Jade",effect:"Enhances luck, financial flow, wise decisions and long-term prosperity"},
];

export function analyzeCrystals(name: string, dob: string): CrystalAnalysis {
  const moolank = calcMoolank(dob);
  const bhagyank = calcBhagyank(dob);

  const moolankCrystals = CRYSTALS_BY_PLANET[moolank] || [];
  const bhagyankCrystals = CRYSTALS_BY_PLANET[bhagyank] || [];

  // Rudraksha: primary = moolank mukhi, secondary = bhagyank mukhi, 5-mukhi universal
  const rudrakshaKeys = [...new Set([moolank, bhagyank, 5])].filter(k => RUDRAKSHA_DATA[k]);
  const rudraksha = rudrakshaKeys.map(k => RUDRAKSHA_DATA[k]);

  const gems: GemSuggestion[] = [];
  if (moolank === 1 || bhagyank === 1) gems.push({name:"Ruby (Manik)",purpose:"Strengthens Sun energy — leadership, confidence, vitality"});
  if (moolank === 2 || bhagyank === 2) gems.push({name:"Pearl (Moti)",purpose:"Strengthens Moon — emotional balance, peace, intuition"});
  if (moolank === 3 || bhagyank === 3) gems.push({name:"Yellow Sapphire (Pukhraj)",purpose:"Strengthens Jupiter — wisdom, fortune, spirituality"});
  if (moolank === 4 || bhagyank === 4) gems.push({name:"Hessonite (Gomed)",purpose:"Pacifies Rahu — clarity, removes confusion, protection"});
  if (moolank === 5 || bhagyank === 5) gems.push({name:"Emerald (Panna)",purpose:"Strengthens Mercury — communication, intellect, business"});
  if (moolank === 6 || bhagyank === 6) gems.push({name:"Diamond / Opal",purpose:"Strengthens Venus — love, luxury, creativity, relationships"});
  if (moolank === 7 || bhagyank === 7) gems.push({name:"Cat's Eye (Lehsuniya)",purpose:"Pacifies Ketu — spiritual growth, letting go, intuition"});
  if (moolank === 8 || bhagyank === 8) gems.push({name:"Blue Sapphire (Neelam)",purpose:"Strengthens Saturn — discipline, karma, career stability"});
  if (moolank === 9 || bhagyank === 9) gems.push({name:"Red Coral (Moonga)",purpose:"Strengthens Mars — courage, energy, vitality, land matters"});

  // Chakra suggestions based on weak areas
  const chakraSuggestions = [
    {chakra:"Root (Muladhara)",crystals:["Black Tourmaline","Hematite","Red Jasper","Garnet"]},
    {chakra:"Heart (Anahata)",crystals:["Green Aventurine","Rose Quartz","Malachite","Jade"]},
    {chakra:"Third Eye (Ajna)",crystals:["Lapis Lazuli","Amethyst","Iolite","Azurite"]},
    {chakra:"Crown (Sahasrara)",crystals:["Clear Quartz","Amethyst","Selenite","Moonstone"]},
  ];

  return {
    clientName: name, dob, moolank, bhagyank,
    moolankPlanet: PLANET_NAME[moolank] || "Unknown",
    bhagyankPlanet: PLANET_NAME[bhagyank] || "Unknown",
    moolankCrystals, bhagyankCrystals,
    moolankBracelet: BRACELET_MOOLANK[moolank] || "Clear Quartz",
    bhagyankBracelet: BRACELET_BHAGYANK[bhagyank] || "Clear Quartz",
    rudraksha, gems,
    combinations: COMBINATIONS,
    chakraSuggestions,
  };
}
