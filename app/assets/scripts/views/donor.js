'use strict';
import React from 'react';
import path from 'path';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import Print from '../components/print-btn';
import { shortTally, tally, shortText } from '../utils/format';
import slugify from '../utils/slugify';
import { GOVERNORATE, getProjectCentroids, getFeatureCollection } from '../utils/map-utils';

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
    const basepath = '/' + this.props.meta.lang;

    const donorName = this.props.params.name;
    let donorDisplayName;

    const donorProjects = projects.filter((project) => {
      return get(project, 'budget', []).some((item) => {
        let sluggedName = slugify(item.donor_name);
        if (sluggedName === donorName) {
          donorDisplayName = item.donor_name;
        }
        return sluggedName === donorName;
      });
    });
    const markers = getProjectCentroids(donorProjects, get(this.props.api, 'geography.' + GOVERNORATE + '.features'));
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

    const singleProject = donorProjects.length <= 1 ? ' funding--single' : '';
    const t = get(window.t, [this.props.meta.lang, 'donor_pages'], {});
    return (
      <section className='inpage funding'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><Print lang={this.props.meta.lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={this.props.meta.lang}/></li>
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
                <Map markers={markers} location={mapLocation} />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li> ${shortTally(totalBudget)} <small>{t.donor_stats_funds}</small></li>
                  <li> {tally(donorProjects.length)} <small>{singleProject ? t.donor_stats_funded_1 : t.donor_stats_funded_2} {t.donor_stats_funded_3}</small></li>
                </ul>
                <div className='inpage__overview-chart'>
                  <div className='chart-content'>
                    <h3>{t.donor_chart_title}</h3>
                    {!singleProject && (<HorizontalBarChart
                      lang={this.props.meta.lang}
                      data={chartData}
                      margin={{ left: 130, right: 50, top: 10, bottom: 50 }}
                      xFormat={shortTally}
                      yFormat={shortText}
                    />)}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--small'>{t.funded_title}</h1>
              <ul className='projects-list'>
                {donorProjects.map((p) => {
                  return (
                    <li key={p.id} className='projects-list__card'>
                      <ProjectCard lang={this.props.meta.lang}
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
