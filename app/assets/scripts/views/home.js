'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Map from '../components/map';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import PieChart from '../components/charts/pie';
import { parseProjectDate } from '../utils/date';

const barChartMargin = { left: 150, right: 10, top: 10, bottom: 50 };

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    api: React.PropTypes.object
  },

  render: function () {
    const projects = this.props.api.projects;
    const categories = {};
    const status = { ontime: 0, delayed: 0 };
    projects.forEach(function (project) {
      project.categories.forEach(function (category) {
        categories[category] = categories[category] + 1 || 1;
      });

      let planned = parseProjectDate(project.planned_end_date);
      let actual = parseProjectDate(project.actual_end_date);
      if (!actual || !planned) {
        return;
      } else if (actual > planned) {
        status.delayed += 1;
      } else {
        status.ontime += 1;
      }
    });

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

              <HorizontalBarChart
                data={bars}
                margin={barChartMargin}
                yTitle=''
                xTitle='By category' />

              <PieChart data={pie} />

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
