'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { t } from '../utils/i18n';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
  },

  render: function () {
    return (
      <div>
        <h1>{t('hello')}</h1>
        <Link to='/ar'>Ar</Link> <Link to='/en'>En</Link>
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
