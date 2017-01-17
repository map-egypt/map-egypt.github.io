'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {shortText, tally} from '../utils/format';
import { get } from 'object-path';
import path from 'path';
import { window } from 'global';
import Map from '../components/map';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import PieChart from '../components/charts/pie';
import { isOntime } from '../components/project-card';
import { GOVERNORATE, getProjectCentroids } from '../utils/map-utils';
import slugify from '../utils/slugify';

const barChartMargin = { left: 200, right: 10, top: 10, bottom: 50 };

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  render: function () {
    const { projects } = this.props.api;
    const { lang } = this.props.meta;
    const categories = {};
    const status = { ontime: 0, delayed: 0 };
    projects.forEach(function (project) {
      get(project, 'categories', []).forEach(function (category) {
        categories[category[lang]] = categories[category[lang]] + 1 || 1;
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

    const markers = getProjectCentroids(projects, get(this.props.api, 'geography.' + GOVERNORATE + '.features'));

    const basepath = '/' + this.props.meta.lang;
    const bars = Object.keys(categories).map((category) => ({
      name: category,
      link: path.resolve(basepath, 'category', slugify(category)),
      value: categories[category]
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const totalProjects = projects.length;
    let totalDonors = {};
    let totalFunding = 0;
    projects.forEach((project) => {
      project.budget.forEach((budget) => {
        totalDonors[budget.donor_name] = '';
        totalFunding += budget.fund.amount;
      });
    });
    totalDonors = Object.keys(totalDonors).length;

    console.log('totalProjects: ', totalProjects, 'totalDonors: ', totalDonors, 'totalFunding: ', totalFunding);

    const pie = [{
      name: 'On Time',
      value: status.ontime
    }, {
      name: 'Delayed',
      value: status.delayed
    }];

    const t = get(window.t, [lang, 'homepage'], {});
    return (
      <div>
      <section className='inpage home'>
        <header className='inpage__header'>
          <div className='inner'>
            <p className='inpage__subtitle--alt'>{t.subhead}</p>
            <h1 className='inpage__title heading--deco heading--xxlarge'>{t.title}</h1>
            <div className='inpage__introduction'>
              <p className='inpage__description'>{t.description}</p>
              <Link to={basepath + '/about'} type='button' className='button button--primary button--large'>{t.more}</Link>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <Map markers={markers} lang={lang} />
            <section className='inpage__section'>
              <div className='overview-home'>
                <h2 className='section__title'>Overview of Agricultural Projects</h2>
                <p className='section__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{totalProjects}<small>total projects</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{totalFunding}<small>in funding</small></h3>
                    <ul className='link-list'>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                      <li><a title='Visit project webpage' href='' className='link--primary'><span>Project Name</span></a></li>
                    </ul>
                  </li>
                </ul>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{totalDonors}<small>total donors</small></h3>
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
                <Link to={basepath + '/projects'} type='button' className='button button--primary button--large'>View All Projects</Link>
              </div>
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <h2 className='section__title'>Other Progress Indicators</h2>
            <p className='section__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
            <ul className='section__footer'>
              <li><Link to={'/' + lang + '/projects_sds'} type='button' className='button button--primary button--large'>SDS Indicators</Link></li>
              <li><Link to={'/' + lang + '/projects_sdg'} type='button' className='button button--primary button--large'>SDG Indicators</Link></li>
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
