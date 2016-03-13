var React = require('react');
require('./selected-regions-info.css');

var SelectedRegionsInfo = React.createClass({
  create_case_data: function(region) {
    var epi_display_strings = this.props.region_details.get_epi_data_display_strings(
      this.props.selected_date.current_day, region.region_code);
    if (epi_display_strings) {
      return <div className="selected-region-info-epi-data">
        {epi_display_strings.map(function(s, i) { return <div key={i}>{s}</div>; })}
      </div>;
    } else {
      return <em>No data avilable.</em>;
    }
  },

  create_region_panel: function(region) {
    // TODO(jetpack): remove area and add population, weather data, and mosquito data.
    return <div className="selected-region-info" key={region.name}>
      <h3>{region.name}</h3>
      <div>Area: {region.geo_area_sqkm} km²</div>
      <div>Case data: {this.create_case_data(region)}</div>
    </div>;
  },

  render: function() {
    var selected_regions_data = this.props.region_details.get_selected_regions_data();
    if (selected_regions_data.length) {
      return <div className="selected-regions-info">
        {selected_regions_data.map(this.create_region_panel)}
      </div>;
    } else {
      return <div className="selected-regions-info">
        <p className="selected-regions-help">
          Click an administrative region for more data.
        </p>
      </div>;
    }
  }
});

module.exports = SelectedRegionsInfo;
