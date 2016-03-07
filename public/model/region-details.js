/**
 * Model for region details. Combines other models (selected regions, etc.) and data stores.
 */

var P = require('pjs').P;
var Q = require('q');
var topojson = require('topojson');

var RegionDetails = P({
  init: function(onUpdate, api_client, selected_regions, weather_data_store) {
    this.onUpdate = onUpdate;
    this.selected_regions = selected_regions;
    this.weather_data_store = weather_data_store;
    // TODO(jetpack): maybe this should be a separate class, like weather_data_store.
    // `region_data_by_code` is a map from region code to region data. Region
    // data has fields `name`, `region_code`, and `geo_area_sqkm`.
    this.region_data_by_code = {};
    // GeoJSON FeatureCollection. The features' properties include the region
    // data fields.
    this.region_feature_collection = {};
    var get_region_data_promise = api_client.get_region_data()
        .then(this.process_region_data.bind(this))
        .fail(function(err) { console.error(err); });
    this.load_promise = Q.all([weather_data_store.initial_load_promise,
                               get_region_data_promise]);
  },

  process_region_data: function(data) {
    if (data.type !== 'Topology') {
      throw new Error('Bad JSON data');
    } else {
      this.region_feature_collection = topojson.feature(data, data.objects.collection);
      var region_data_by_code = this.region_data_by_code;
      data.objects.collection.geometries.forEach(function(obj) {
        // FWIW, `properties` also has `country_code`.
        region_data_by_code[obj.properties.region_code] =
          _.pick(obj.properties, ['name', 'region_code', 'geo_area_sqkm']);
      });
    }
  },

  get_geojson_features: function() {
    return this.region_feature_collection.features;
  },

  toggle_region: function(region_code) {
    // TODO(jetpack): if toggling *on*, fetch weather data
    this.selected_regions.toggle_region(region_code);
  },

  get_selected_regions_data: function() {
    var region_data_by_code = this.region_data_by_code;
    return this.selected_regions.get_region_codes().map(function(region_code) {
      return region_data_by_code[region_code];
    });
  }

});

module.exports = RegionDetails;