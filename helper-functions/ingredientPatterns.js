const E_NUMBERS = require("./haram-e-numbers");

const alcoholRegex =
  /alcohol|biers?$|rijst.?wijn|(witte|rode).?wijn|sake$|wijn|mirin/;
const stremselRegex = /stremsel|rennet|runsel|stremstof/;
const vleesRegex =
  /vlees|varken|bacon|(?<!w)kip(pen)?|chicken|kalfs|lams?$|rund|salami|pepp?eroni|kalkoen|gehakt\b|bitterbal|spare.?rib|zwijn|buffalo/;
const vetzurenRegex =
  /vetzuren|fatty.acid|vetzuur|poly.?oxyethyleen|glyceride|glycerol|glyco|lipid/;
const kipeiRegex =
  /kip(pe.)?.?ei|chicken egg|\b(kip)(pen)?(heel)?ei(wit|geel)?|heel.?ei|ei(geel|wit)|vrije.?uitloop|eieren/;
const plantaardigRegex =
  /pla.ntaardig|plant.?based|plant.?origin|plant.?derived|plant.?extract|soja|vegan?|vegetarisch|stevio|niet.dierlijk.?|houth.rs/;
const wijnAzijnRegex =
  /wijn.?azijn|wijn.?zuur|(diacetyl)?wijnsteenzuur|kermirin|wijnblad|wijnsteen|alcohol.?azijn/;
const halalRegex = /halal|ḥalāl|حلال|halaal|helal/;
const fruitFleshRegex = /vrucht|vruchtvlees|cocosvlees|kokos/;
const halalMeatRegex =
  /mossel|zalm|skipjack|vis|fish|fijngehakt|visvetzuren|makreel|kreeft|krab/;
const shrimpRegex = /garnaal|gamba|shrimp|garnal|scampi|udang/;
const exceptionsRegex = /geen|polyvinyl|free from|alcoholvrije/;
const messages = {
  vetzuur:
    "Emulgator en stabilisator. De glyceriden worden gebruikt om water en vet te mengen en om producten in een bepaalde toestand te houden. Soms wordt dierlijk vet zoals varkensvet gebruikt. Hierdoor is het in sommige gevallen niet geschikt voor veganisten, vegetariërs en sommige religies.",
};

const halalPatterns = [
  { regex: plantaardigRegex, reason: "Bevat plantaardig of vegan bron" },
  { regex: kipeiRegex, reason: "Bevat ei" },
  { regex: halalRegex, reason: "Bevat het woordje halal" },
  { regex: halalMeatRegex, reason: "Bron is vis" },
  { regex: fruitFleshRegex, reason: "Vruchtvlees is niet haram" },
  { regex: exceptionsRegex, reason: "Is een uitzondering" },
  {
    regex: wijnAzijnRegex,
    reason: "Bevat wijnazijn",
  },
];
const doubtfulPatterns = [
  ...E_NUMBERS,
  {
    regex: stremselRegex,
    explanation: "Bevat stremsel",
    title: "stremsel",
    schoolOfThought: ["shafi", "maliki", "hanbali"],
  },
  {
    regex: vetzurenRegex,
    explanation: messages.vetzuur,
    title: "vetzuur",
    schoolOfThought: ["shafi", "hanbali"],
  },
];
const haramPatterns = [
  {
    regex: vleesRegex,
    explanation: "Bevat vlees",
    title: "vlees",
    consensus: true,
    haram: true,
  },
  {
    regex: alcoholRegex,
    explanation: "Bevat alcohol",
    title: "alcohol",
    consensus: true,
    haram: true,
  },
  {
    regex: shrimpRegex,
    explanation: "Bevat garnalen",
    title: "garnaal",
    consensus: false,
    haram: true,
    schoolOfThought: ["hanafi"],
  },
];

function splitAllIngredientsToArray(ingredientsString) {
  if (!ingredientsString) {
    return [];
  }

  const cleanIngredientsReg =
    /\d+(,\d+)?%|\x5d|\d{1,2}\s%|bevatt?e?n? |u002f|amp;|nbsp|_x000d_|emulgatore?n?|conserveermiddele?n?|antioxidante?n?|kleurstoff?e?n?|voeding?szuu?re?n?|stabilisatore?n?|bevat mogelijk|kan\s\w+\sbevatten|kan\s *|van biologische? oorsprong|^andere|\d+([,.]\d+)?%|\d{1,2}\smg|ingredi.nte?n?|dit product|producte?n?|ingemaakte|specerijen|ingredi[ëe]nte?n?|oa\s|0a\s/gim;
  // converts e numbers from e 252 to e252
  const eNumberRegex = /e\s(\d{3})/g;

  const cleanedArray = ingredientsString
    .replace(cleanIngredientsReg, "")
    .replace(eNumberRegex, "e$1")
    .trim();

  const splitIngredientsReg = /[^a-zA-Z0-9_ï ë'é]| en /gm;

  const splitIngredientsArray = cleanedArray
    .split(splitIngredientsReg)
    .map((ingredient) => {
      return ingredient.replace(splitIngredientsReg, "").trim().toLowerCase();
    });
  return splitIngredientsArray;
}

function checkIngredientStatus(ingredient) {
  if (!ingredient) {
    return;
  }
  const current_ingredient = ingredient.toLowerCase();

  for (const pattern of halalPatterns) {
    const regex = new RegExp(pattern.regex);
    if (regex.test(current_ingredient) === true) {
      return { current_ingredient, halal: true, reason: pattern.reason };
    }
  }
  const checkPattern = (pattern, current_ingredient) => {
    const regex = new RegExp(pattern.regex);
    if (regex.test(current_ingredient) === true) {
      return { pattern, current_ingredient };
    }
  };
  for (const pattern of doubtfulPatterns) {
    const status = checkPattern(pattern, current_ingredient);
    if (status) return status;
  }
  for (const pattern of haramPatterns) {
    const status = checkPattern(pattern, current_ingredient);
    if (status) return status;
  }
}

module.exports = {
  splitAllIngredientsToArray,
  checkIngredientStatus,
  doubtfulPatterns,
  haramPatterns,
};
