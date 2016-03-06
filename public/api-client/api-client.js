/**
 * NOTE: For now, we just throw a bunch of API logic together. This probably isn't the best
 * approach.
 */

var P = require('pjs').P;
var Q = require('q');
var jQuery = require('jquery');
var DateUtil = require('../model/date-util.js');

var SUPPORTED_COUNTRIES = ['br'];

var makeRequest = function(url) {
  var deferred = Q.defer();

  jQuery.ajax({
    method: 'GET',
    url: url,
    success: function(data) {
      deferred.resolve(data);
    },
    fail: function(error) {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

var APIClient = P({
  init: function(country_code) {
    if (!SUPPORTED_COUNTRIES.includes(country_code)) {
      alert("INTERNAL ERROR: country '" + country_code + "' not supported");
    }
    this.country_code = country_code;
  },
  get_region_data: function() {
    // NOTE: this is a bit manually-optimized, using a separate resource
    // file for regions polygons. Consider switching to more standard
    // webpack-based approach.
    //
    // return makeRequest("/api/regions/" + this.country_code);
    return makeRequest("/admin_polygons_" + this.country_code + ".topo.json");
  },
  get_weather_data: function(date) {
    // When no date_str specified, we get the latest data available.
    var date_str = '';
    if (date === undefined) {
      console.log('No date specified - fetching latest available data..');
    } else {
      date_str = '/' + DateUtil.iso_to_yyyymmdd(date);
    }
    return makeRequest('/api/country_weather/' + country_code + date_str);
  }
});

module.exports = APIClient;
