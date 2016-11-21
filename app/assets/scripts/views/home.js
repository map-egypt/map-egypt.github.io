'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Map from './map';
// import HorizontalBarChart from '../components/charts/horizontal-bar';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    api: React.PropTypes.object
  },

  render: function () {

    const projects = this.props.api.projects;

    return (
      <div>
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <p className='inpage__subtitle--alt'>tracking egypt</p>
            <h1 className='inpage__title heading--deco heading--xxlarge'>Agricultural Progress and Impact</h1>
            <div className='inpage__introduction'>
              <p className='inpage__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
              <button type='button' className='button button--primary button--large'>Learn More</button>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section'>
              <Map />
              <div className='overview-home'>
                <h2 className='section__title'>Overview of Agricultural Projects</h2>
                <p className='section__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className='section__footer'>
                <button type='button' className='button button--primary button--large'>View All Projects</button>
              </div>
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <h2 className='section__title'>Other Progress Indicators</h2>
            <p className='section__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
            <ul className='section__footer'>
              <li><button type='button' className='button button--primary button--large'>SDS Indicators</button></li>
              <li><button type='button' className='button button--primary button--large'>SDG Indicators</button></li>
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
    api: state.api
  };
}

module.exports = connect(mapStateToProps)(Home);
