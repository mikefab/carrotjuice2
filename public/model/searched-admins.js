/**
 * Which admins the user has left in search box.
 */

var P = require('pjs').P;

var SearchedAdmins = P({
  init: function(onUpdate) {
    this.onUpdate = onUpdate;
    // `searched_admin_codes` is a map from admin code to callbacks. The
    // callbacks are called when the admin is unsearched.
    this.searched_admin_codes = {};
    this.hovered_admin_code = null;
  },

  // Note: `on_unsearch` is only used when `admin_code` is toggled on.
  toggle_admin: function(admin_code, on_unselect) {
    if (this.is_admin_searched(admin_code)) {
      var cb = this.searched_admin_codes[admin_code];
      delete this.searched_admin_codes[admin_code];
      cb();
    } else {
      this.searched_admin_codes[admin_code] = on_unsearch || _.noop;
    }
    this.onUpdate();
  },

  search_admin: function(admin_code, on_unsearch) {
    if (this.is_admin_searched(admin_code)) {
      console.log('Admin', admin_code, 'already selected, not doing anything.');
      return;
    }

    // We only call the previously searched admins' on_unsearch callbacks after
    // updating `searched_admin_codes`. This is so that when the callbacks run,
    // `searched_admin_codes` accurately reflects what is now searched.
    var unsearch_cbs = _.values(this.searched_admin_codes);
    this.searched_admin_codes = {};
    this.searched_admin_codes[admin_code] = on_unsearch || _.noop;
    unsearch_cbs.forEach(function(cb) { cb(); });

    this.onUpdate();
  },

  get_admin_codes: function() {
    return _.keys(this.selected_admin_codes);
  },

  is_admin_searched: function(admin_code) {
    return _.has(this.searched_admin_codes, admin_code);
  },

  get_border_weight: function(admin_code) {
    if (this.is_admin_searched(admin_code)) {
      return 3;
    } else if (this.hovered_admin_code === admin_code) {
      return 2;
    } else {
      return 1;
    }
  }
});

module.exports = SearchedAdmins;
