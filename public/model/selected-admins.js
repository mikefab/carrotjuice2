/**
 * Which admins the user has selected.
 */

var P = require('pjs').P;
var EventEmitter = require('../event-emitters/event-emitter-base.js');
var SearchAdminEvent = require('../event-emitters/search-admin-event.js');
var SelectAdminEvent = require('../event-emitters/select-admin-event.js');

var SelectedAdmins = P({
  init: function() {
    this.emitter = new EventEmitter([SearchAdminEvent, SelectAdminEvent]);
    // `selected_admin_codes` is a map from admin code to callbacks. The
    // callbacks are called when the admin is unselected.
    this.selected_admin_codes = {};
    this.hovered_admin_code = null;

    // `searched_admin_codes` is a map from admin code to callbacks. The
    // callbacks are called when the admin is unsearched.
    this.searched_admin_codes = {};
  },

  // Note: `on_unselect` is only used when `admin_code` is toggled on.
  toggle_admin: function(admin_code, on_unselect) {
    // TODO(zora): Migrate these callbacks to an event-emitter-like pattern?
    if (this.is_admin_selected(admin_code)) {
      var cb = this.selected_admin_codes[admin_code];
      delete this.selected_admin_codes[admin_code];
      cb();
    } else {
      this.selected_admin_codes[admin_code] = on_unselect || _.noop;
    }
    this.emitter.emit(new SelectAdminEvent(this.get_admin_codes()));
  },

  set_admin_hovered: function(admin_code) {
    this.hovered_admin_code = admin_code;
  },

  unset_admin_hovered: function(admin_code) {
    if (this.hovered_admin_code === admin_code) {
      this.hovered_admin_code = null;
    }
  },

  select_admin: function(admin_code, on_unselect) {
    if (this.is_admin_selected(admin_code)) {
      console.log('Admin', admin_code, 'already selected, not doing anything.');
      return;
    }

    // We only call the previously selected admins' on_unselect callbacks after
    // updating `selected_admin_codes`. This is so that when the callbacks run,
    // `selected_admin_codes` accurately reflects what is now selected.
    var unselect_cbs = _.values(this.selected_admin_codes);
    this.selected_admin_codes = {};
    this.selected_admin_codes[admin_code] = on_unselect || _.noop;
    unselect_cbs.forEach(function(cb) { cb(); });

    this.emitter.emit(new SelectAdminEvent(this.get_admin_codes()));
  },

  search_admin: function(admin_code, on_unsearch) {
    this.select_admin(admin_code);
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

    // currently, we only search for 1 admin code, but maybe we could show
    // all the matching ones or something for partial search matches?
    this.emitter.emit(new SearchAdminEvent([admin_code]));
  },

  get_admin_codes: function() {
    return _.keys(this.selected_admin_codes);
  },

  is_admin_selected: function(admin_code) {
    return _.has(this.selected_admin_codes, admin_code);
  },

  is_admin_searched: function(admin_code) {
    return _.has(this.searched_admin_codes, admin_code);
  },

  get_border_weight: function(admin_code) {
    if (this.is_admin_selected(admin_code)) {
      return 3;
    } else if (this.hovered_admin_code === admin_code) {
      return 2;
    } else {
      return 1;
    }
  }
});

module.exports = SelectedAdmins;
