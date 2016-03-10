var React = require('react');
require('./selected-regions-info.css');

var SelectedRegionsInfo = React.createClass({
  create_case_data: function(region) {
    var epi_display_string = this.props.region_details.get_epi_data_display_string(
      this.props.selected_date.current_day, region.region_code);
    if (epi_display_string) {
      return <div className="selected-region-info-epi-data"
                  dangerouslySetInnerHTML={{__html: epi_display_string}}>
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
      <div>Case data: {this.create_case_data(region)}
      </div>
    </div>;
  },

  render: function() {
    var selected_region_codes = this.props.selected_regions.get_region_codes();
    var selected_regions_props = selected_region_codes.map((function(region_code) {
      return this.props.region_details.get_region_properties(region_code);
    }).bind(this));

    if (selected_regions_props.length) {
      return <div className="selected-regions-info">
        {selected_regions_props.map(this.create_region_panel)}
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
