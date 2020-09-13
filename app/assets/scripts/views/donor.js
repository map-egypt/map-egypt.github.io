'use strict';
import React from 'react';
import path from 'path';
import { connect } from 'react-redux';
import { get } from 'object-path';
import CSVBtn from '../components/csv-btn';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import Print from '../components/print-btn';
import { shortTally, tally, shortText, currency } from '../utils/format';
import slugify from '../utils/slugify';
import { getProjectCentroids, getFeatureCollection } from '../utils/map-utils';
import { window } from 'global';

var Donor = React.createClass({
  displayName: 'Donor',

  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  render: function () {
    const projects = get(this.props, 'api.projects', []);
    if (projects.length === 0) {
      return <div></div>; // TODO loading indicator
    }
    const { lang } = this.props.meta;
    const basepath = '/' + lang;
    const donorName = this.props.params.name;
    let donorMeta;
    const donorProjects = projects.filter((project) => {
      return get(project, 'budget', []).some((item) => {
        console.log(item);
        let sluggedName = slugify(item.donor.en);
        if (sluggedName === donorName) {
          donorMeta = item.donor;
        }
        return sluggedName === donorName;
      });
    });
    const donorDisplayName = donorMeta[lang];

    const markers = getProjectCentroids(donorProjects, this.props.api.geography);
    const mapLocation = getFeatureCollection(markers);

    const projectBudgets = donorProjects
      .map((project) => project.budget)
      .reduce((a, b) => a.concat(b), []);

    const chartData = donorProjects.map((project) => {
      return {
        name: project.name,
        link: path.resolve(basepath, 'projects', project.id),
        value: project.budget.reduce((cur, item) => cur + item.fund.amount, 0)
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    // TODO change this to 2 amounts dispursed and remaining
    const totalBudget = projectBudgets.reduce((currentValue, budget) => {
      return budget.fund.amount + currentValue;
    }, 0);

    const csvSummary = {
      title: 'Donor Summary',
      data: {
        budget: totalBudget,
        projects_funded: donorProjects.length
      }
    };

    const csvChartData = [
      {
        title: 'Donor Project Funding',
        data: chartData
      }
    ];

    const singleProject = donorProjects.length <= 1 ? ' funding--single' : '';
    const t = get(window.t, [lang, 'donor_pages'], {});
    return (
      <section className='inpage funding'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                <li><CSVBtn
                    title={donorDisplayName}
                    relatedProjects={donorProjects}
                    summary={csvSummary}
                    chartData={csvChartData}
                    lang={lang} /></li>
                  <li><Print lang={lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={lang}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{donorDisplayName}</h1>
            </div>
          </div>
        </header>
        <div className={'inpage__body funding' + singleProject}>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>

              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
                <Map markers={markers} location={mapLocation} lang={lang} />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li> {currency(shortTally(totalBudget))} <small>{t.donor_stats_funds}</small></li>
                  <li> {tally(donorProjects.length)} <small>{singleProject ? t.donor_stats_funded_1 : t.donor_stats_funded_2} {t.donor_stats_funded_3}</small></li>
                </ul>
                {!singleProject && (
                  <div className='inpage__overview-chart'>
                    <div className='chart-content'>
                    <HorizontalBarChart
                      lang={lang}
                      data={chartData}
                      margin={{ left: 130, right: 50, top: 10, bottom: 50 }}
                      xFormat={shortTally}
                      yFormat={shortText}
                    />
                  </div>
                </div>)}
              </div>
            </section>
          </div>

          <section className='inpage__section--bleed inpage__section--print'>
            <div className='inner'>
              <h1 className='section__title heading--small'>{t.funded_title}</h1>
              <ul className='projects-list'>
                {donorProjects.map((p) => {
                  return (
                    <li key={p.id} className='projects-list__card'>
                      <ProjectCard lang={lang}
                        project={p} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </section>
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

module.exports = connect(mapStateToProps)(Donor);
