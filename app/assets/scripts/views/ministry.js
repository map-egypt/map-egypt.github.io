'use strict';
import React from 'react';
import path from 'path';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import { shortTally, tally, shortText } from '../utils/format';

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
    const basepath = '/' + this.props.meta.lang;

    const ministryName = this.props.params.name;
    let ministryDisplayName;

    const lang = this.props.meta.lang;
    const ministryProjects = projects.filter((project) => {
      return project.responsible_ministry[lang] === ministryName;
    });

    const projectBudgets = ministryProjects
      .map((project) => project.budget)
      .reduce((a, b) => a.concat(b), []);

    const chartData = ministryProjects.map((project) => {
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

    const singleProject = ministryProjects.length <= 1 ? ' ministry--single' : '';

    return (
      <section className='inpage ministry'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><button className='button button--medium button--primary button--download'>Download</button></li>
                  <li><Share path={this.props.location.pathname}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{ministryDisplayName}</h1>
            </div>
          </div>
        </header>
        <div className={'inpage__body ministry' + singleProject}>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>

              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
                <Map />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li> {shortTally(totalBudget)} <small>Total Funds</small></li>
                  <li> {tally(ministryProjects.length)} <small>{singleProject ? 'Project' : 'Projects'} Funded</small></li>
                </ul>
                <div className='inpage__overview-chart'>
                  {!singleProject && (<HorizontalBarChart
                    data={chartData}
                    margin={{ left: 300, right: 50, top: 10, bottom: 50 }}
                    xFormat={shortTally}
                    yFormat={shortText}
                  />)}
                </div>
              </div>
            </section>
          </div>

          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--small'>Projects Contributed To</h1>
              <ul className='projects-list'>
                {ministryProjects.map((p) => {
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

module.exports = connect(mapStateToProps)(Ministry);
