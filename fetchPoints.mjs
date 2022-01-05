import dayjs from "https://unpkg.com/dayjs@1.10.7/esm/index.js?module";
import dayjs_tz from "https://unpkg.com/dayjs@1.10.7/esm/plugin/timezone/index.js?module";
import dayjs_utc from "https://unpkg.com/dayjs@1.10.7/esm/plugin/utc/index.js?module";

dayjs.extend(dayjs_tz);
dayjs.extend(dayjs_utc);

/**
 * @param {string} boundingBoxString
 * @param {number} [durationDays]
 * @returns {Promise<any[] | false | undefined>}
 */
export async function fetchPoints(boundingBoxString, durationDays = 180) {
  window._aborters.forEach((aborter) => aborter.abort());
  const ab = new AbortController();
  window._aborters = [];
  window._aborters.push(ab);

  const url = new URL(
    `https://portal-gb.one.network/prd-portal-one-network/data/`
  );
  const params = url.searchParams;

  const today = dayjs().subtract(12, "hours").format("DD/MM/YYYY HH:mm");
  const end = dayjs().add(durationDays, "days").format("DD/MM/YYYY HH:mm");

  params.append("get", "Points");
  params.append("b", boundingBoxString);
  params.append("filterstartdate", today);
  params.append("filterenddate", end);
  params.append("filterimpact", "1,2,3,4");
  params.append("organisation_id", "1");
  params.append("t", "cw");
  params.append("extended_func_id", "14");
  params.append("mapzoom", "16");
  params.append("mode", "v7");
  params.append("lang", "en-GB");
  params.append("_", new Date().getTime().toString());

  let response;
  try {
    response = await fetch(url.toString(), { signal: ab.signal });
  } catch {
    return undefined;
  }

  const json = await response.json();

  if (json.datapointslimit) {
    // Too many points in the bounding box -- ask to zoom in
    return false;
  }

  /**
   * @type {string[]}
   */
  const columns = json.query.columnlist.split(",");
  const data = json.query.data;
  const count = json.query.recordcount;

  const dataPoints = [];

  for (let i = 0; i < count; i++) {
    const point = {};

    columns.forEach((col) => {
      point[col] = data[col][i];
    });

    dataPoints.push(point);
  }

  return dataPoints;
}

export async function getSpecificPointData(se_id, phase_id) {
  const url = new URL(`https://api-gb.one.network/map/callout/streetwork`);
  const params = url.searchParams;

  params.append("historicWorks", "false");
  params.append("id", se_id);
  params.append("phase_id", phase_id);
  params.append("mode", "v7");
  params.append("lang", "en-GB");
  params.append("_", new Date().getTime().toString());

  let response;
  try {
    response = await fetch(url.toString());
  } catch {
    return undefined;
  }

  const json = await response.json();

  return json;
}

window.fetchPoints = fetchPoints;
