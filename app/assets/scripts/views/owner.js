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
import { shortTally, shortText } from '../utils/format';
import { getProjectCentroids, getFeatureCollection } from '../utils/map-utils';
import slugify from '../utils/slugify';

var Owner = React.createClass({
  displayName: 'Owner',

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

    const ownerName = this.props.params.name;
    let ownerDisplayName;

    const lang = this.props.meta.lang;
    const ownerProjects = projects.filter((project) => {
      let name = project.local_manager;
      if (name) {
        const sluggedName = slugify(name);
        if (sluggedName === ownerName) {
          ownerDisplayName = name;
        }
        return sluggedName === ownerName;
      }
    });

    const markers = getProjectCentroids(ownerProjects, this.props.api.geography);
    const mapLocation = getFeatureCollection(markers);

    const chartData = ownerProjects.map((project) => {
      return {
        name: project.name,
        link: path.resolve(basepath, 'projects', project.id),
        value: project.number_served.number_served
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const singleProject = ownerProjects.length <= 1 ? ' funding--single' : '';
    const numActiveProjects = ownerProjects.filter((project) => project.actual_end_date).length;

    const csvSummary = {
      title: 'Owner Summary',
      data: {
        active_projects: numActiveProjects,
        total_projects: ownerProjects.length
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
                      title={ownerDisplayName}
                      relatedProjects={ownerProjects}
                      summary={csvSummary}
                      chartData={csvChartData}
                      lang={lang} /></li>
                  <li><button className='button button--medium button--primary button--download'>Download</button></li>
                  <li><Share path={this.props.location.pathname} lang={this.props.meta.lang}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{ownerDisplayName}</h1>
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
                  <li> {numActiveProjects} <small>Active {numActiveProjects > 1 ? 'Projects' : 'Project'}</small></li>
                  <li> {ownerProjects.length} <small>Total {ownerProjects.length > 1 ? 'Projects' : 'Project'}</small></li>
                </ul>
                {!singleProject && (
                <div className='inpage__overview-chart'>
                  <div className='chart-content'>
                  <h3>Number Served</h3>
                  <HorizontalBarChart
                    lang={this.props.meta.lang}
                    data={chartData}
                    margin={{ left: 300, right: 50, top: 10, bottom: 50 }}
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
              <h1 className='section__title heading--small'>Projects Contributed To</h1>
              <ul className='projects-list'>
                {ownerProjects.map((p) => {
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

module.exports = connect(mapStateToProps)(Owner);
