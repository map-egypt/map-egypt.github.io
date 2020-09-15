'use strict';
import React from 'react';
import path from 'path';
import { connect } from 'react-redux';
import { get } from 'object-path';
import CSVBtn from '../components/csv-btn';
import Share from '../components/share';
import Print from '../components/print-btn';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import ProjectTimeline from '../components/project-timeline';
import { shortTally, shortText } from '../utils/format';
import slugify from '../utils/slugify';
import { getProjectCentroids, getFeatureCollection } from '../utils/map-utils';
import { getProjectName } from '../utils/accessors';

var Ministry = React.createClass({
  displayName: 'Ministry',

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
    const sluggedName = this.props.params.name;
    const ministryProjects = projects.filter(project => get(project, 'responsible_ministry.en') && sluggedName === slugify(project.responsible_ministry.en));
    const ministryDisplayName = get(ministryProjects, [0, 'responsible_ministry', lang]);

    const markers = getProjectCentroids(ministryProjects, this.props.api.geography);
    const mapLocation = getFeatureCollection(markers);

    const chartData = ministryProjects.map((project) => {
      return {
        name: getProjectName(project, lang),
        link: path.resolve(basepath, 'projects', project.id),
        value: get(project, 'number_served', []).reduce((total, item) => total + get(item, 'number_served'), 0)
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const singleProject = ministryProjects.length <= 1 ? ' funding--single' : '';
    const activeProjects = ministryProjects.filter((project) => project.actual_end_date);
    const numActiveProjects = activeProjects.length;

    const csvSummary = {
      title: 'Ministry Summary',
      data: {
        active_projects: numActiveProjects,
        total_projects: ministryProjects.length
      }
    };

    const csvChartData = [
      {
        title: 'Number Served Per Project',
        data: chartData
      }
    ];

    return (
      <section className='inpage owner'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                <li><CSVBtn
                    title={ministryDisplayName}
                    relatedProjects={ministryProjects}
                    summary={csvSummary}
                    ministryActiveProjects={activeProjects}
                    chartData={csvChartData}
                    lang={lang} /></li>
                  <li><Print lang={lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={lang}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{ministryDisplayName}</h1>
            </div>
            {ministryProjects.map((project, i) => {
              if (!project.actual_end_date) {
                return (
                  <div key ={'timeline-' + i}>
                    <h5>{getProjectName(project)}</h5>
                    <ProjectTimeline project={project} lang={lang}/>
                  </div>
                );
              }
            })}
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
                  <li> {numActiveProjects} <small>Active {numActiveProjects > 1 ? 'Projects' : 'Project'}</small></li>
                  <li> {ministryProjects.length} <small>Total {ministryProjects.length > 1 ? 'Projects' : 'Project'}</small></li>
                </ul>
                <div className='inpage__overview-chart'>
                  {chartData.length > 1 && (<div className='chart-content'>
                    <h3>Number Served</h3>
                    <HorizontalBarChart
                      lang={lang}
                      data={chartData}
                      margin={{ left: 140, right: 50, top: 10, bottom: 50 }}
                      xFormat={shortTally}
                      yFormat={shortText}
                    />
                  </div>)}
                </div>
              </div>
            </section>
          </div>

          <section className='inpage__section--bleed inpage__section--print'>
            <div className='inner'>
              <h1 className='section__title heading--small'>Projects Overseen</h1>
              <ul className='projects-list'>
                {ministryProjects.map((p) => {
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

module.exports = connect(mapStateToProps)(Ministry);
