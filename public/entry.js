var React = require('react');
var ReactDOM = require('react-dom');

var mainViews = require('./view/main.jsx');

ReactDOM.render(
  React.createElement(mainViews.AppMain, null),
  document.getElementById("main-content")
);
