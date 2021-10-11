export const networkAliases = {
  o2: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
  vf: ["Vodafone", "Vodaphone"],
  "3/EE": ["T-Mobile", "T Mobile", "Three", "3", "Hutchinson", "EE"],
  ctil: ["CTIL", "cornerstone", "corner stone"],
  // 3: ["3", "H3", "Hutchinson", "Three"],
  // mbnl: ["MBNL", "Mobile Broadband Network"],
  // ee: [
  //   "EE",
  //   "Everything Everywhere",
  //   "EverythingEverywhere",
  //   "T Mobile",
  //   "T-Mobile",
  // ],
};

const networkIcons = {
  o2: createIcon("o2"),
  vf: createIcon("vf"),
  ctil: createIcon("ctil"),
  "3/EE": createIcon("3/EE"),
  3: createIcon("3"),
  mbnl: createIcon("mbnl"),
  ee: createIcon("ee"),
};

const networkNames = {
  o2: "O2",
  vf: "Vodafone",
  ctil: "Cornerstone",
  "3/EE": "Three/EE",
  3: "Three UK",
  ee: "EE",
  mbnl: "MBNL",
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
