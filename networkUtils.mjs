export const networkAliases = {
  o2: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
  vf: ["Vodafone", "Vodaphone"],
  "3/EE": ["T-Mobile", "T Mobile"],
  ctil: ["CTIL", "cornerstone", "corner stone"],
};

const networkIcons = {
  o2: createIcon("O2"),
  vf: createIcon("VF"),
  "3/EE": createIcon("3/EE"),
  ctil: createIcon("CTIL"),
};

const networkNames = {
  o2: "O2",
  vf: "Vodafone",
  "3/EE": "Three/EE",
  ctil: "Cornerstone",
};

function createIcon(name) {
  return L.divIcon({
    html: `<b>${name.toUpperCase()}</b><span></span>`,
    className: "network-icon",
    iconSize: null,
    iconAnchor: [25, 28],
  });
}

function getNetworkId(dataPoint) {
  const name = dataPoint.promoter.toLowerCase();

  return Object.keys(networkAliases).find((key) => {
    const aliases = networkAliases[key];
    return aliases.some((x) => name.includes(x.toLowerCase()));
  });
}

/**
 * @param {string} name
 */
export function getNetworkIcon(dataPoint) {
  return networkIcons[getNetworkId(dataPoint)];
}

/**
 * @param {string} name
 */
export function getNetworkName(dataPoint) {
  return networkNames[getNetworkId(dataPoint)];
}

export function isNetworkDataPoint(dataPoint) {
  return getNetworkId(dataPoint) !== undefined;
}
