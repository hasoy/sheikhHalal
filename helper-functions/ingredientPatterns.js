import eNumbers from "./haram-e-numbers.json" assert { type: "json" };
import URLS from "../../front-end/constants/Host.js";
import fetch from "node-fetch";

const alcohol = /alcohol|biers?$|wijn|sake$/;
const stremsel = /stremsel|rennet|runsel|stremstof/;
const vlees =
  /vlees|varken|bacon|(?<!w)kip(pen)?|chicken|(?<!w)koe$|kalfs>|lams?$|rund|salami|pepp?eroni|kalkoen|gehakt|bitterbal/;
const vetzurenRegex =
  /vetzuren|fatty.acid|vetzuur|poly.?oxyethyleen|glyceride|glycerol|glyco|lipid/;

const kipeiRegex =
  /kip(pe.)?.?ei|chicken egg|\b(kip)(pen)?(heel)?ei(wit|geel)?|heel ei/;
const plantaardigRegex =
  /plantaardig|plant.?based|plant.?origin|plant.?derived|plant.?extract|soja|vegan?|gehakte|vegetarisch/;
const halalRegex = /halal|ḥalāl|حلال|halaal|helal/;
const halalMeatRegex = /mossel|zalm|skipjack/;

const messages = {
  vetzuur:
    "Emulgator en stabilisator. De glyceriden worden gebruikt om water en vet te mengen en om producten in een bepaalde toestand te houden. Soms wordt dierlijk vet zoals varkensvet gebruikt. Hierdoor is het in sommige gevallen niet geschikt voor veganisten, vegetariërs en sommige religies.",
};

const halalPatterns = [
  { regex: plantaardigRegex, reason: "Bevat plantaardig of vegan bron" },
  { regex: kipeiRegex, reason: "Bevat ei" },
  { regex: halalRegex, reason: "Bevat het woordje halal" },
  { regex: halalMeatRegex, reason: "Bron is vis" },
];
export const doubtfulPatterns = [
  ...eNumbers,
  {
    regex: stremsel,
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
export const haramPatterns = [
  {
    regex: vlees,
    explanation: "Bevat vlees",
    title: "vlees",
    consensus: true,
    haram: true,
  },
  {
    regex: alcohol,
    explanation: "Bevat alcohol",
    title: "alcohol",
    consensus: true,
    haram: true,
  },
];

export function splitAllIngredientsToArray(ingredientsArray) {
  if (!ingredientsArray) {
    return [];
  }

  const regExAllIngredients =
    /\d+(,\d+)?%|\x5d|\d{1,2}\s%|[kK]an (.*)|bevatt?e?n? |emulgatore?n?|conserveermiddele?n?|antioxidante?n?|kleurstoff?e?n?|voeding?szuu?re?n?|stabilisatore?n?|bevat mogelijk|kan\s\w+\sbevatten|kan\s *|van biologische? oorsprong|^andere|\d+([,.]\d+)?%|\d{1,2}\smg|ingredi.nte?n?|dit product|producte?n?|ingemaakte|specerijen|ingredi[ëe]nte?n?|oa\s|0a\s/gim;
  // converts e numbers from e 252 to e252
  const eNumberRegex = /e\s(\d{3})/g;

  const cleanedArray = ingredientsArray
    .replace(regExAllIngredients, "")
    .replace(eNumberRegex, "e$1")
    .trim();

  const splitRegex = /[^a-zA-Z0-9_ï ë'-]/gm;

  const splitIngredientsArray = cleanedArray
    .split(splitRegex)
    .map((ingredient) => {
      return ingredient.replace(splitRegex, "").trim().toLowerCase();
    });
  return splitIngredientsArray;
}

export function checkIngredientStatus(ingredient) {
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

  const allPatterns = [...haramPatterns, ...doubtfulPatterns];
  for (const pattern of allPatterns) {
    const regex = new RegExp(pattern.regex);
    if (regex.test(current_ingredient) === true) {
      return { pattern, current_ingredient };
    }
  }
}

export async function findIngredientId(title) {
  const postedIngredient = await fetch(
    `${URLS.HOST}${URLS.INGREDIENT_STATE}?filters[title][$eqi]=${title}`
  );
  const res = await postedIngredient.json();
  return res.data[0] ? res.data[0].id : null;
}
