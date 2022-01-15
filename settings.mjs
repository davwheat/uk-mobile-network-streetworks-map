import { loadPoints } from "./main.mjs";
import { promoterIds, promoters } from "./networkUtils.mjs";

/**
 * @returns {Record<string, boolean>}
 */
export function getPromoterStates() {
  /**
   * @type {Record<string, string>}
   */
  const promoterIdsByCategory = {};

  promoters.forEach((promoter) => {
    promoterIdsByCategory[promoter.category] ||= [];
    promoterIdsByCategory[promoter.category].push(promoter.id);
  });

  const strSetting = localStorage.getItem("disabledPromoters");
  let arr;

  try {
    arr = JSON.parse(strSetting);

    if (!Array.isArray(arr)) {
      throw new Error("Invalid disabled promoters value. Resetting...");
    }
  } catch {
    arr = [];
    localStorage.setItem("disabledPromoters", "[]");
  }

  return promoterIds.reduce((acc, curr) => {
    acc[curr] = !arr.includes(curr);
    return acc;
  }, {});
}

export function setPromoterState(promoterId, state) {
  const states = getPromoterStates();

  states[promoterId] = state;

  const disabledIds = Object.entries(states)
    .map(([id, enabled]) => {
      if (!enabled) return id;
      return null;
    })
    .filter((x) => x !== null);

  localStorage.setItem("disabledPromoters", JSON.stringify(disabledIds));
}
