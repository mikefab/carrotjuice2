var React = require('react');
var Typeahead = require('react-typeahead').Typeahead;

var AdminSearch = React.createClass({
  admins: function() {
    var admin_objs = this.props.admin_details.admin_data_by_code;
    var available_countries = Object.keys(
      this.props.selected_countries.selected_country_codes
    );

    var admins = Object.keys(this.props.admin_details.admin_data_by_code)
    .filter(function(key) {
      var admin_code = admin_objs[key].admin_code.split('-')[0];
      return available_countries.find(function(e) {
        return e === admin_code;
      });
    }).map(function(key) {
      return admin_objs[key].name;// + ' ' + admin_objs[key].admin_code.split('-')[0]
    }).sort();
    return admins;
  },

  optionSelected: function() {
    console.log(this.props.admin_details);
    var argument = arguments[0];
    var admin_objs = this.props.admin_details.admin_data_by_code;
    var admin = Object.keys(this.props.admin_details.admin_data_by_code)
    .find(function(key) {
      return admin_objs[key].name === argument;//.split(/\s/)[0];
    });

    this.props.admin_details.selected_admins.select_admin(admin);
    console.log(this.props.admin_details)
    console.log("FFFF")
  },

  autoComplete: function() {
    console.log(this.admins());
  },

  render: function() {
    return <div className="admin-search">
      Search: <Typeahead
    options={this.admins()}
    onOptionSelected={this.optionSelected}
    maxVisible={10}
  />
    </div>;
  }
});

module.exports = AdminSearch;
