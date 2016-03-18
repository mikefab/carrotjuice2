var L = require('leaflet');
var basemaps = require('./basemaps.js');

module.exports = function(map_element) {
  var map_center = [-23.3, -46.3];  // São Paulo.
  var map_zoom = 5;
  var min_map_zoom = 4;
  var max_map_zoom = 12;

  var map = L.map(map_element, {
    center: map_center,
    zoom: map_zoom,
    minZoom: min_map_zoom,
    maxZoom: max_map_zoom,
    fadeAnimation: false,
    layers: [basemaps.CartoDB],
    zoomControl: false  // Added manually below.
  });

  map.attributionControl.setPrefix('Carotene');
  L.control.layers(basemaps).addTo(map);
  L.control.scale({position: 'bottomright'}).addTo(map);
  // The zoom control is added manually so that it's above the scale control.
  L.control.zoom({position: 'bottomright'}).addTo(map);
  return map;
};
