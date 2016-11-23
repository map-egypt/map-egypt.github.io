'use strict';
import React from 'react';
import { connect } from 'react-redux';
import PageFooter from '../components/page-footer';
import PageHeader from '../components/page-header';

var UhOh = React.createClass({
  displayName: 'UhOh',

  propTypes: {
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    meta: React.PropTypes.object
  },

  render: function () {
    return (
    <div>
      <PageHeader
        location={this.props.location}
        dispatch={this.props.dispatch}
        authenticated={this.props.api.authenticated}
        lang={this.props.meta.lang || 'en'}
      />
      <div className='error'>
        <div className='error-content'>
          <h1 className='heading--xxlarge heading--deco'>Page Not Found</h1>
          <p>We were not able to find the page you're looking for.</p>
          <button className='button button--primary button--large'>Take Me Home</button>
        </div>
      </div>
      <PageFooter />
    </div>
    );
  }
});

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(UhOh);
