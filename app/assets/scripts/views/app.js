'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import _ from 'lodash';
import c from 'classnames';

import { isValidLanguage, setLanguage, isLtr } from '../utils/i18n';
import PageFooter from '../components/page-footer';
import PageHeader from '../components/page-header';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func
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

  onWindowResize: function () {
    if (document.documentElement.clientWidth >= 800) {
      document.documentElement.classList.remove('offcanvas-revealed');
    }
  },

  //
  // Start life-cycle methods
  //
  componentWillMount: function () {
    this.validateLanguage(this.props.params.lang);
    this.updateLangClass(this.props.params.lang);
  },

  componentDidMount: function () {
    window.addEventListener('resize', _.throttle(this.onWindowResize, 50));
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
        <PageHeader
          location={this.props.location}
          dispatch={this.props.dispatch}
          authenticated={this.props.api.authenticated}
          lang={this.props.meta.lang}
        />
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
      <PageFooter />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(App);
