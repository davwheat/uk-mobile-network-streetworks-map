import { getPromoterStates } from "./settings.mjs";

export const promoters = [
  // Mobile networks
  {
    id: "o2",
    name: "O2",
    aliases: ["O2", "02", "O 2", "Telefonica", "Telefónica"],
    category: "Mobile network",
    icon: {
      text: "O2",
      type: "mobile",
    },
  },
  {
    id: "vf",
    name: "Vodafone",
    aliases: ["Vodafone", "Vodaphone"],
    category: "Mobile network",
    icon: {
      text: "VF",
      type: "mobile",
    },
  },
  {
    id: "3/EE",
    name: "Three/EE",
    aliases: ["T-Mobile", "T Mobile"],
    category: "Mobile network",
    icon: {
      text: "3/EE",
      type: "mobile",
    },
  },
  {
    id: "ctil",
    name: "Cornerstone Networks",
    aliases: ["Cornerstone", "CTIL"],
    category: "Mobile network",
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
    category: "Fixed broadband",
    icon: {
      text: "BT",
      type: "bt",
    },
  },
  {
    id: "or",
    name: "Openreach",
    aliases: ["Openreach", "open reach"],
    category: "Fixed broadband",
    icon: {
      text: "OR",
      type: "bt",
    },
  },
  {
    id: "virgin",
    name: "Virgin Media",
    aliases: ["Virgin", "Virgin Media"],
    category: "Fixed broadband",
    icon: {
      text: "VM",
      type: "vm",
    },
  },
  {
    id: "cf",
    name: "CityFibre",
    aliases: ["CityFibre", "City Fibre"],
    category: "Fixed broadband",
    icon: {
      text: "CF",
      type: "cityfibre",
    },
  },
  {
    id: "trooli",
    name: "Trooli",
    aliases: ["Trooli"],
    category: "Fixed broadband",
    icon: {
      text: "TR",
      type: "trooli",
    },
  },
  {
    id: "grain",
    name: "Grain",
    aliases: ["Grain"],
    category: "Fixed broadband",
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
    category: "Fixed broadband",
    icon: {
      text: "OFNL",
      type: "ofnl",
    },
  },
  {
    id: "toob",
    name: "TOOB",
    aliases: ["Toob"],
    category: "Fixed broadband",
    icon: {
      text: "TOOB",
      type: "toob",
    },
  },
  {
    id: "zzoomm",
    name: "Zzoomm",
    aliases: ["Zzoomm"],
    category: "Fixed broadband",
    icon: {
      text: "ZOOM",
      type: "zzoomm",
    },
  },
  {
    id: "netomnia",
    name: "Netomnia",
    aliases: ["Netomnia"],
    category: "Fixed broadband",
    icon: {
      text: "NO",
      type: "netomnia",
    },
  },
];

export const promoterIds = promoters.map((x) => x.id);

export const promoterAliases = promoters.reduce((acc, promoter) => {
  acc[promoter.id] = promoter.aliases;
  return acc;
}, {});

export const promoterIcons = promoters.reduce((acc, promoter) => {
  acc[promoter.id] = createPromoterIcon(promoter.icon.text, promoter.icon.type);
  return acc;
}, {});

export const promoterNames = promoters.reduce((acc, promoter) => {
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

export function getPromoterIcon(dataPoint) {
  return promoterIcons[getPromoterId(dataPoint)];
}

export function getPromoterName(dataPoint) {
  return promoterNames[getPromoterId(dataPoint)];
}

export function isPromoterDataPoint(dataPoint) {
  const id = getPromoterId(dataPoint);

  if (!id) return false;

  const states = getPromoterStates();
  if (!states[id]) return false;

  return true;
}
