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
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <p className='inpage__subtitle--home'>tracking egypt</p>
            <h1 className='inpage__title--home heading--deco heading--xxlarge'>Agricultural Progress and Impact</h1>
            <div className='inpage__introduction--home'>
              <p className='description--home'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
              <button className='button button--primary button--large'>Learn More</button>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section'>
              <div className='map--home'>
              </div>
              <div className='overview--home'>
                <h2 className='inpage__section--title'>Overview of Agricultural Projects</h2>
                <p className='inpage__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
                <div className='stats--home'>
                  <ul className='category-reductions'>
                    <li className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                  </ul>
                  <ul className='category-reductions'>
                    <li className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                  </ul>
                  <ul className='category-reductions'>
                    <li className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                    <li><a href='' className='link--primary'>Project Name</a></li>
                  </ul>
                </div>
              </div>
              <div className='inpage__section--footer'>
                <button className='button button--primary button--large'>View All Projects</button>
              </div>
            </section>
          </div>
          <section className='inpage__section--related'>
            <h2 className='inpage__section--title'>Other Progress Indicators</h2>
            <p className='inpage__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
            <ul className='inpage__section--footer'>
              <li><button className='button button--primary button--large'>SDS Indicators</button></li>
              <li><button className='button button--primary button--large'>SDG Indicators</button></li>
            </ul>
          </section>
        </div>
      </section>
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
