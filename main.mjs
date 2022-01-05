import { fetchPoints, getSpecificPointData } from "./fetchPoints.mjs";
import { trackUserLocation } from "./getUserLocation.mjs";
import {
  getPromoterIcon,
  getPromoterName,
  isPromoterDataPoint,
} from "./networkUtils.mjs";
import { debounce } from "https://unpkg.com/throttle-debounce@3.0.1/esm/index.js?module";

import dayjs from "https://unpkg.com/dayjs@1.10.7/esm/index.js?module";
import dayjs_tz from "https://unpkg.com/dayjs@1.10.7/esm/plugin/timezone/index.js?module";
import dayjs_utc from "https://unpkg.com/dayjs@1.10.7/esm/plugin/utc/index.js?module";
import DataMarker from "./DataMarker.mjs";

dayjs.extend(dayjs_tz);
dayjs.extend(dayjs_utc);

const map = L.map("map").setView([51.505, -0.09], 13);

window._aborters = [];
window.markerGroup = L.layerGroup().addTo(map);

const geolocationMarker = {
  marker: L.marker([0, 0], {
    icon: L.icon({
      iconUrl: "geo.svg",
      iconSize: [18, 18],
    }),
  }),
  added: false,
};

map.attributionControl.setPrefix(
  `<a style="font-weight:bold;" href="https://github.com/davwheat/uk-mobile-network-streetworks-map">This project is open source!</a>`
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

map.attributionControl.addAttribution(
  `&copy; <a href="https://one.network">one.network</a>`
);

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

map.on(
  "moveend",
  debounce(1000, async () => {
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
      isPromoterDataPoint
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

    /**
     * @type {DataMarker[]}
     */
    const oldMarkers = window.markerGroup?.getLayers() || [];
    const newPoints = [];

    dataPoints.forEach((point) => {
      const matchingOldMarker = oldMarkers.findIndex(
        (marker) => marker.data.se_id === point.se_id
      );

      // Remove matching marker
      if (matchingOldMarker !== -1) oldMarkers.splice(matchingOldMarker, 1);
      else newPoints.push(point);
    });

    oldMarkers.forEach((marker) => window.markerGroup.removeLayer(marker));

    newPoints.map((point) => {
      console.log(point);
      const name = getPromoterName(point);

      const marker = new DataMarker([point.latitude, point.longitude], point, {
        icon: getPromoterIcon(point),
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
              
            <h2>Work description</h2>
            <p>${point.works_desc || "None provided"}</p>
              
            <h2>Work permit ref</h2>
            <p>${point.permit_ref || "None provided"}</p>
              
            <h2>Promoter</h2>
            <p>${point.promoter || "None provided"}</p>
              
            <h2>Current status</h2>
            <p>${
              point.works_state_name ||
              dayjs.tz(point.start_date, point.start_date_tz).diff(dayjs()) < 0
                ? "Works in progress"
                : dayjs.tz(point.end_date, point.start_date_tz).diff(dayjs()) <
                  0
                ? "Completed"
                : "Upcoming"
            }</p>
              
            <h2>Permit status</h2>
            <p id="${point.se_id}__permit_status_desc">Loading...</p>
              
            <!--<h2>Info last updated</h2>
            <p>${point.promoter || "None provided"}</p>
              
            <h2>Last updated one one.network</h2>
            <p>${point.promoter || "None provided"}</p>-->
          `
        )
        .addTo(window.markerGroup)
        .on("popupopen", function (e) {
          console.log("OPENED", e);

          const elementId = `${e.target.data.se_id}__permit_status_desc`;

          getSpecificPointData(
            e.target.data.se_id || e.target.data.entity_id,
            e.target.data.phase_id
          ).then((data) => {
            const el = document.getElementById(elementId);
            if (!el) return;

            el.innerText = data.swdata.permit_status_desc;
          });
        });
    });
  })
);
