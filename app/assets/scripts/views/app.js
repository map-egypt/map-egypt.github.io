'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import _ from 'lodash';
import c from 'classnames';

import { isValidLanguage, setLanguage, isLtr } from '../utils/i18n';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    children: React.PropTypes.object,
    params: React.PropTypes.object
  },

  validateLanguage: function (lang) {
    if (isValidLanguage(lang)) {
      setLanguage(lang);
    } else {
      hashHistory.replace('/uhoh');
    }
  },

  updateLangClass: function (lang) {
    if (isValidLanguage(lang)) {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.classList.remove('lang--ltr', 'lang--rtl');
      const langClass = isLtr(lang) ? 'lang--ltr' : 'lang--rtl';
      document.documentElement.classList.add(langClass);
    }
  },

  //
  // Start life-cycle methods
  //
  componentWillMount: function () {
    this.validateLanguage(this.props.params.lang);
    this.updateLangClass(this.props.params.lang);
  },

  componentWillReceiveProps: function (nextProps) {
    this.validateLanguage(nextProps.params.lang);
    this.updateLangClass(nextProps.params.lang);
  },

  //
  // Start render methods
  //
  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
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

module.exports = connect(mapStateToProps)(App);
