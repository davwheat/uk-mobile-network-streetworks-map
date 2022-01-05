export const promoterAliases = {
  o2: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
  vf: ["Vodafone", "Vodaphone"],
  "3/EE": ["T-Mobile", "T Mobile"],
  ctil: ["CTIL", "cornerstone", "corner stone"],
  bt: ["BT", "British Telecom"],
  openreach: ["Openreach", "open reach"],
  virgin: ["Virgin Media"],
  cityfibre: ["CityFibre", "City Fibre"],
};

const promoterIcons = {
  o2: createPromoterIcon("O2", "mobile"),
  vf: createPromoterIcon("VF", "mobile"),
  "3/EE": createPromoterIcon("3/EE", "mobile"),
  ctil: createPromoterIcon("CTIL", "mobile"),
  bt: createPromoterIcon("BT", "bt"),
  openreach: createPromoterIcon("OR", "bt"),
  cityfibre: createPromoterIcon("CF", "cityfibre"),
  virgin: createPromoterIcon("VM", "vm"),
};

const promoterNames = {
  o2: "O2",
  vf: "Vodafone",
  "3/EE": "Three/EE",
  ctil: "Cornerstone",
  bt: "BT",
  openreach: "Openreach",
  virgin: "Virgin Media",
  cityfibre: "CityFibre",
};

function createPromoterIcon(name, type) {
  return L.divIcon({
    html: `<b>${name.toUpperCase()}</b><span></span>`,
    className: `network-icon network-icon__${type}`,
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
