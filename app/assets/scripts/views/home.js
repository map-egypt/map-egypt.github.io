'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {shortText, tally} from '../utils/format';
import { get } from 'object-path';
import getCentroid from '@turf/centroid';
import Map from '../components/map';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import PieChart from '../components/charts/pie';
import { isOntime } from '../components/project-card';
import * as governorates from '../utils/governorates';
import { GOVERNORATE } from '../utils/map-utils';

const barChartMargin = { left: 200, right: 10, top: 10, bottom: 50 };

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  render: function () {
    const { projects, authenticated } = this.props.api;
    const categories = {};
    const regions = {};
    const status = { ontime: 0, delayed: 0 };
    projects.forEach(function (project) {
      get(project, 'categories', []).forEach(function (category) {
        categories[category] = categories[category] + 1 || 1;
      });

      get(project, 'location', []).forEach(function (location) {
        // TODO look at district or marker to see if there's more granular data
        const region = location.district.governorate;
        regions[region] = regions[region] || [];
        regions[region].push(project);
      });

      const ontime = isOntime(project);
      if (ontime === null) {
        return;
      } else if (ontime) {
        status.ontime += 1;
      } else {
        status.delayed += 1;
      }
    });

    const markers = [];
    const features = get(this.props.api, 'geography.' + GOVERNORATE + '.features');
    if (features) {
      Object.keys(regions).forEach(function (id) {
        const meta = governorates.byId(id);
        const feature = features.find((f) => f.properties.admin_id === meta.egy);
        const centroid = get(getCentroid(feature), 'geometry.coordinates');
        if (centroid) {
          regions[id].forEach(function (project) {
            markers.push({
              centroid,
              region: meta.name,
              name: project.name
            });
          });
        }
      });
    }

    const bars = Object.keys(categories).map((category) => ({
      name: category,
      value: categories[category]
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const pie = [{
      name: 'On Time',
      value: status.ontime
    }, {
      name: 'Delayed',
      value: status.delayed
    }];

    return (
      <div>
      <section className='inpage home'>
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
            <Map markers={markers}/>
            <section className='inpage__section'>
              <div className='overview-home'>
                <h2 className='section__title'>Overview of Agricultural Projects</h2>
                <p className='section__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>20%<small>reduction in poverty</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className='overview-home-charts'>
                <div className='chart-content chart__inline--labels'>
                  <h3>Number of Projects By Category</h3>
                  <HorizontalBarChart
                    data={bars}
                    margin={barChartMargin}
                    yFormat={shortText}
                    xFormat={tally}
                    yTitle='' />
                </div>
                <div className='chart-content chart__inline--labels'>
                  <h3> Status </h3>
                  <PieChart data={pie} />
                  <div className='status-key'>
                    <p className='status-key__label status-ontime'>On Time</p>
                    <p className='status-key__label status-delayed'>Delayed</p>
                  </div>
                </div>
              </div>
              <div className='section__footer'>
                <Link to={'/' + this.props.meta.lang + '/projects'} type='button' className='button button--primary button--large'>View All Projects</Link>
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
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(Home);
