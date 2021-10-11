const options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

/**
 * @param {(pos: GeolocationPosition, id: number) => void} positionCallback
 */
export function trackUserLocation(positionCallback) {
  const id = navigator.geolocation.watchPosition(
    (position) => {
      positionCallback(position, id);
    },
    () => {},
    options
  );
}
