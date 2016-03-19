/**
 * Stores socioeconomic data.
 *
 * NOTE! This is just a sketch. Data is *not* fetched from the backend, but just hardcoded for now.
 * It's not clear we even need a separate data store - perhaps we can just store this with admin
 * data, if we don't expect it to change over time.
 */

var _ = require('lodash');
var P = require('pjs').P;
var Q = require('q');
var d3 = require('d3');

var EconDataStore = P({
  init: function(on_update) {
    this.on_update = on_update;

    this.spending_by_admin = {};

    this.initial_load_promise = Q.delay(10).then((function() {
      this.spending_by_admin = require('./hardcoded-econ-data.js');
    }).bind(this))
      .catch(function(err) { console.error('Error getting socioeconomic data:', err); });
  },

  // Note: date ignored: we only have 1 set of data.
  admin_color_for_date: function() {
    var domain = _.reduce(this.spending_by_admin, function(domain, spending) {
      if (spending < domain[0]) { domain[0] = spending; }
      if (domain[1] < spending) { domain[1] = spending; }
      return domain;
    }, [Infinity, -Infinity]);
    // TODO(jetpack): log vs. linear?
    var spending_to_color = d3.scale.log().domain(domain)
        .range(['red', 'green']);
    console.log('Generating socioeconomic color data for domain', domain);
    return _.mapValues(this.spending_by_admin, function(spending) {
      return spending_to_color(spending) || '#ccc';
    });
  }

});

module.exports = EconDataStore;
