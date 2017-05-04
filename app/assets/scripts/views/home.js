'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import { shortText, tally, shorterTally } from '../utils/format';
import { get } from 'object-path';
import path from 'path';
import { window } from 'global';
import Map from '../components/map';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import PieChart from '../components/charts/pie';
import { isOntime } from '../components/project-card';
import { getProjectCentroids } from '../utils/map-utils';
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
    const status = { ontime: 0, delayed: 0, extended: 0 };
    projects.forEach(function (project) {
      get(project, 'categories', []).forEach(function (category) {
        categories[category[lang]] = categories[category[lang]] + 1 || 1;
      });

      const ontime = isOntime(project);
      if (ontime === null) {
        return;
      } else if (ontime === 'delayed') {
        status.delayed += 1;
      } else if (ontime === 'extended') {
        status.extended += 1;
      } else {
        status.ontime += 1;
      }
    });

    const markers = getProjectCentroids(projects, this.props.api.geography);

    const basepath = '/' + this.props.meta.lang;
    const bars = Object.keys(categories).map((category) => ({
      name: category,
      link: path.resolve(basepath, 'category', slugify(category)),
      value: categories[category]
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const totalProjects = projects.length;
    let totalDonors = {};
    let totalFunding = 0;
    const collaborations = [];
    let collaborationCount = 0;
    projects.forEach((project) => {
      let collaborators = project.budget.filter((b) => {
        return b.donor_name !== 'MoALR / Government of Egypt contribution' && b.donor_name !== 'Government of Egypt' && b.donor_name !== 'Project Beneficiaries';
      });
      if (collaborators.length > 1) {
        collaborators.forEach((c) => collaborations.push(c.donor_name));
        collaborationCount += 1;
      }
      project.budget.forEach((budget) => {
        totalDonors[budget.donor_name] = '';
        totalFunding += budget.fund.amount;
      });
    });
    totalFunding = shorterTally(totalFunding);
    totalDonors = Object.keys(totalDonors).length;
    const collaboratorNames = _.uniq(collaborations).sort((a, b) => a.length < b.length);

    const pie = [{
      name: 'On Time',
      value: status.ontime
    }, {
      name: 'Delayed',
      value: status.delayed
    }, {
      name: 'Extended',
      value: status.extended
    }];

    let budgetSummary = {loan: 0, grant: 0, 'local contribution': 0};
    projects.forEach((project) => {
      get(project, 'budget', []).forEach((fund) => {
        budgetSummary[fund.type.en.toLowerCase()] += fund.fund.amount;
      });
    });
    budgetSummary = [
      {name: 'Loan', value: budgetSummary.loan},
      {name: 'Grant', value: budgetSummary.grant},
      {name: 'Local Contribution', value: budgetSummary['local contribution']}
    ];

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
                <h2 className='section__title'>{t.stats_overview}</h2>
                <p className='section__description'>{t.overview_description}</p>
                <ul className='category-stats'>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{totalProjects}<small>{t.total_projects}</small></h3>
                  </li>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>${totalFunding}<small>{t.in_funding}</small></h3>
                  </li>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{totalDonors}<small>{t.total_donors}</small></h3>
                  </li>
                  <li className='category-stats__item'>
                    <h3 className='inpage-stats heading--deco-small'>{collaborationCount}<small>{t.donor_collaborations}</small></h3>
                    <ul className='inpage-stats__collaborators'>
                      {collaboratorNames.map((name, i) => <li key={i}>{name}</li>)}
                    </ul>
                  </li>
                </ul>
              </div>
              <div className='overview-home-charts'>
                <div className='chart-content chart__inline--labels'>
                  <h3>{t.chart_title_one}</h3>
                  <HorizontalBarChart
                    lang={lang}
                    data={bars}
                    margin={barChartMargin}
                    yFormat={shortText}
                    xFormat={tally}
                    yTitle='' />
                </div>
                <div className='chart-content chart__inline--labels chart-content--status'>
                  <h3>{t.chart_title_two}</h3>
                  <PieChart data={pie} />
                  <div className='status-key'>
                    <p className='status-key__label status-ontime'>{t.chart_two_label}</p>
                    <p className='status-key__label status-delayed'>{t.chart_two_label2}</p>
                    <p className='status-key__label status-extended'>{t.chart_two_label3}</p>
                  </div>
                </div>
                <div className='chart-content chart__inline--labels chart-content--status'>
                  <h3>{t.chart_title_three}</h3>
                  <PieChart data={budgetSummary} />
                  <div className='status-key'>
                    <p className='status-key__label budget-loan'>{t.chart_three_label}</p>
                    <p className='status-key__label budget-grant'>{t.chart_three_label2}</p>
                    <p className='status-key__label budget-local'>{t.chart_three_label3}</p>
                  </div>
                </div>
              </div>
              <div className='section__footer'>
                <Link to={basepath + '/projects'} type='button' className='button button--primary button--large'>{t.all_projects_btn}</Link>
              </div>
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <h2 className='section__title'>{t.other_indicators_title}</h2>
            <p className='section__description'>{t.other_indicators_description}</p>
            <ul className='section__footer'>
              <li><Link to={'/' + lang + '/projects_sds'} type='button' className='button button--primary button--large'>{t.sds_button}</Link></li>
              <li><Link to={'/' + lang + '/projects_sdg'} type='button' className='button button--primary button--large'>{t.sdg_button}</Link></li>
              <li><Link to={'/' + lang + '/projects_other'} type='button' className='button button--primary button--large'>{t.other_button}</Link></li>
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
