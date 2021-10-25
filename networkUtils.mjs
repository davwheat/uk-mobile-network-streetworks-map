export const promoterAliases = {
  o2: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
  vf: ["Vodafone", "Vodaphone"],
  "3/EE": ["T-Mobile", "T Mobile"],
  ctil: ["CTIL", "cornerstone", "corner stone"],
};

const promoterIcons = {
  o2: createPromoterIcon("O2"),
  vf: createPromoterIcon("VF"),
  "3/EE": createPromoterIcon("3/EE"),
  ctil: createPromoterIcon("CTIL"),
};

const promoterNames = {
  o2: "O2",
  vf: "Vodafone",
  "3/EE": "Three/EE",
  ctil: "Cornerstone",
};

function createPromoterIcon(name) {
  return L.divIcon({
    html: `<b>${name.toUpperCase()}</b><span></span>`,
    className: "network-icon",
    iconSize: null,
    iconAnchor: [25, 28],
  });
}

function getPromoterId(dataPoint) {
  const name = dataPoint.promoter.toLowerCase();

  return Object.keys(promoterAliases).find((key) => {
    const aliases = promoterAliases[key];
    return aliases.some((x) => name.includes(x.toLowerCase()));
  });
}

/**
 * @param {string} name
 */
export function getPromoterIcon(dataPoint) {
  return promoterIcons[getPromoterId(dataPoint)];
}

/**
 * @param {string} name
 */
export function getPromoterName(dataPoint) {
  return promoterNames[getPromoterId(dataPoint)];
}

export function isPromoterDataPoint(dataPoint) {
  return getPromoterId(dataPoint) !== undefined;
}
