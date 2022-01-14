export const promoters = [
  // Mobile networks
  {
    id: "o2",
    name: "O2",
    aliases: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
    icon: {
      text: "O2",
      type: "mobile",
    },
  },
  {
    id: "vf",
    name: "Vodafone",
    aliases: ["Vodafone", "Vodaphone"],
    icon: {
      text: "VF",
      type: "mobile",
    },
  },
  {
    id: "3/EE",
    name: "Three/EE",
    aliases: ["T-Mobile", "T Mobile"],
    icon: {
      text: "3/EE",
      type: "mobile",
    },
  },
  {
    id: "ctil",
    name: "Cornerstone Networks",
    aliases: ["Cornerstone", "CTIL"],
    icon: {
      text: "CTIL",
      type: "mobile",
    },
  },

  // Fixed broadband
  {
    id: "bt",
    name: "BT",
    aliases: ["BT", "British Telecom"],
    icon: {
      text: "BT",
      type: "bt",
    },
  },
  {
    id: "or",
    name: "Openreach",
    aliases: ["Openreach", "open reach"],
    icon: {
      text: "OR",
      type: "bt",
    },
  },
  {
    id: "virgin",
    name: "Virgin Media",
    aliases: ["Virgin", "Virgin Media"],
    icon: {
      text: "VM",
      type: "vm",
    },
  },
  {
    id: "cf",
    name: "CityFibre",
    aliases: ["CityFibre", "City Fibre"],
    icon: {
      text: "CF",
      type: "cityfibre",
    },
  },
  {
    id: "trooli",
    name: "Trooli",
    aliases: ["Trooli"],
    icon: {
      text: "TR",
      type: "trooli",
    },
  },
  {
    id: "grain",
    name: "Grain",
    aliases: ["Grain"],
    icon: {
      text: "GR",
      type: "grain",
    },
  },
  {
    id: "ofnl",
    name: "Open Fibre Networks Limited",
    aliases: [
      "Open Fibre Networks Limited",
      "Open Fibre Networks",
      "Open Fibre",
      "Independent Fibre Networks",
      "Independent Fibre",
      "Independent Fibre Networks Limited",
    ],
    icon: {
      text: "OFNL",
      type: "ofnl",
    },
  },
];

const promoterAliases = promoters.reduce((acc, promoter) => {
  acc[promoter.id] = promoter.aliases;
  return acc;
}, {});

const promoterIcons = promoters.reduce((acc, promoter) => {
  acc[promoter.id] = createPromoterIcon(promoter.icon.text, promoter.icon.type);
  return acc;
}, {});

const promoterNames = promoters.reduce((acc, promoter) => {
  acc[promoter.id] = promoter.name;
  return acc;
}, {});

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
