// this is the main entrypoint for our single-page app
var React = require('react');
var OverlayControlsBox = require('./overlay-controls-box.jsx');
var LeafletMap = require('./leaflet-map.jsx');
var MapController = require('../map-controller/map-controller.js');
var APIClient = require('../api-client/api-client.js');

// Load bootstrap. Requires JQuery be made available as
// a global window variable.
require('expose?$!expose?jQuery!jquery');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/js/bootstrap.js');

// module-local style
require('./main.css');

var api_client = APIClient('br');
var map_controller = MapController(api_client);

var AppMain = React.createClass({
  render: function() {
    return (
      <div className="mainContainer">
        <LeafletMap controller={map_controller} />
        <OverlayControlsBox />
      </div>
    );
  }
});

module.exports = {AppMain: AppMain};
