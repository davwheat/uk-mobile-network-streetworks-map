export const networkAliases = {
  o2: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
  vf: ["Vodafone", "Vodaphone"],
  ee: [
    "EE",
    "Everything Everywhere",
    "EverythingEverywhere",
    "T Mobile",
    "T-Mobile",
  ],
  3: ["3", "H3", "Hutchinson", "Three"],
  mbnl: ["MBNL", "Mobile Broadband Network"],
  ctil: ["CTIL", "cornerstone", "corner stone"],
};

const networkIcons = {
  o2: createIcon("o2"),
  vf: createIcon("vf"),
  ee: createIcon("ee"),
  3: createIcon("3"),
  mbnl: createIcon("mbnl"),
  ctil: createIcon("ctil"),
};

const networkNames = {
  o2: "O2",
  vf: "Vodafone",
  ee: "EE",
  3: "Three UK",
  mbnl: "MBNL",
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
