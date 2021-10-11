import { fetchPoints } from "./fetchPoints.mjs";
import { trackUserLocation } from "./getUserLocation.mjs";
import {
  getNetworkIcon,
  getNetworkName,
  isNetworkDataPoint,
} from "./networkUtils.mjs";

window._aborters = [];
window.markerGroup = null;

const map = L.map("map").setView([51.505, -0.09], 13);

const geolocationMarker = { marker: L.marker([0, 0]), added: false };

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

L.control.scale({ imperial: true, metric: true }).addTo(map);

function markLocated() {
  document.getElementById("geolocation").classList.add("located");
}

function markUnlocated() {
  document.getElementById("geolocation").classList.remove("located");
}

function flyToGeolocation() {
  map.flyTo(geolocationMarker.marker.getLatLng(), 14);
  markLocated();
}

document.getElementById("geolocation").addEventListener("click", () => {
  flyToGeolocation();
});

trackUserLocation((position, id) => {
  // position update received!
  const { latitude, longitude } = position.coords;

  geolocationMarker.marker.setLatLng([latitude, longitude]);

  if (!geolocationMarker.added) {
    geolocationMarker.marker.addTo(map);
    geolocationMarker.added = true;
    flyToGeolocation();
  }
});

map.on("moveend", async () => {
  document.getElementById("loading-message").classList.add("show");

  if (map.getCenter().equals(geolocationMarker.marker.getLatLng(), 0.00001)) {
    markLocated();
  } else {
    markUnlocated();
  }

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