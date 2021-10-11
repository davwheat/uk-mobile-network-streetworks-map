import { fetchPoints } from "./fetchPoints.mjs";
import {
  getNetworkIcon,
  getNetworkName,
  isNetworkDataPoint,
} from "./networkUtils.mjs";

window._aborters = [];
window.markerGroup = null;

const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

L.control.scale({ imperial: true, metric: true }).addTo(map);

map.on("moveend", async () => {
  document.getElementById("loading-message").classList.add("show");

  const bounds = map.getBounds();
  const zoom = map.getZoom();

  if (zoom < 13) {
    document.getElementById("loading-message").classList.remove("show");
    document.getElementById("please-zoom-message").classList.add("show");
    return;
  }

  const bbString = bounds.toBBoxString();
  const dataPoints = (await fetchPoints(bbString))?.filter?.(
    isNetworkDataPoint
  );

  document.getElementById("loading-message").classList.remove("show");

  if (dataPoints === false) {
    document.getElementById("failed-message").classList.add("show");
    return;
  } else {
    document.getElementById("failed-message").classList.remove("show");
  }

  if (dataPoints === undefined) {
    document.getElementById("please-zoom-message").classList.add("show");
    return;
  } else {
    document.getElementById("please-zoom-message").classList.remove("show");
  }

  window.markerGroup?.clearLayers();

  window.markerGroup = L.layerGroup().addTo(map);

  dataPoints.map((point) => {
    const name = getNetworkName(point);
    L.marker([point.latitude, point.longitude], {
      icon: getNetworkIcon(point),
    })
      .bindPopup(
        `
          <h1>${name} works</h1>
          <p>
            ${dayjs
              .tz(point.start_date, point.start_date_tz)
              .format("DD MMM 'YY HH:mm")}
            to
            ${dayjs
              .tz(point.end_date, point.end_date_tz)
              .format("DD MMM 'YY HH:mm")}
          </p>
            
          <p>${point.works_desc}</p>
        `
      )
      .addTo(window.markerGroup);
  });
});
