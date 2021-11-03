export default class DataMarker extends L.Marker {
  /**
   * @type {Record<string, unknown>}
   * @private
   */
  _data;

  constructor(latLng, data, options) {
    super(latLng, options);
    this._data = data;
  }

  get data() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }
}

window.DataMarker = DataMarker;
