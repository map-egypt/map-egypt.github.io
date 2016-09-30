'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
  },

  render: function () {
    return (
      <div>
        Hello <Link to='/es'>Spanish</Link>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
  };
}

module.exports = connect(mapStateToProps)(Home);
