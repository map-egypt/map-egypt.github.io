'use strict';
import React from 'react';
import { connect } from 'react-redux';
import en from '../about/en';
import ar from '../about/ar';

var About = React.createClass({
  displayName: 'About',

  propTypes: {
    meta: React.PropTypes.object
  },

  render: function () {
    const content = this.props.meta.lang === 'ar' ? ar : en;
    return (
      <section className='inpage'>
        <header className='inpage__header--alt'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title heading--deco heading--large'>About</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body--alt'>
          <div className='inner'>
            <section>
              {content}
            </section>
          </div>
        </div>
      </section>
    );
  }
});

function mapStateToProps (state) {
  return {
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(About);
