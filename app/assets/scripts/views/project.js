'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getProject } from '../actions';
import slugify from '../utils/slugify';
import { formatDate, parseProjectDate } from '../utils/date';
import { tally, shortTally, pct, shortText } from '../utils/format';
import { byId } from '../utils/governorates';
import { hasValidToken } from '../utils/auth';

import Map from '../components/map';
import Share from '../components/share';
import ProjectCard from '../components/project-card';
import ProjectTimeline from '../components/project-timeline';
import VerticalBarChart from '../components/charts/vertical-bar';
import HorizontalBarChart from '../components/charts/horizontal-bar';

const barChartMargin = { left: 150, right: 20, top: 10, bottom: 50 };

function linkPath (base, type, id) {
  return path.resolve(base, type, slugify(id));
}

var Project = React.createClass({
  displayName: 'Project',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      authenticated: hasValidToken()
    };
  },

  componentWillMount: function () {
    if (hasValidToken()) {
      this.setState({ authenticated: true });
    }
    this.props.dispatch(getProject(this.props.params.id));
  },

  componentWillReceiveProps: function (props) {
    if (props.api.authenticated && !this.props.api.authenticated && !this.state.authenticated) {
      this.props.dispatch(getProject(this.props.params.id));
      this.setState({ authenticated: true });
    }
  },

  render: function () {
    const authenticated = this.props.api.authenticated;
    const meta = get(this.props.api, ['projectDetail', this.props.params.id]);
    if (!meta) {
      return <div></div>; // TODO loading indicator
    }
    const data = meta.data;
    const basepath = '/' + this.props.meta.lang;
    const ontime = ProjectCard.isOntime(data);
    const lastUpdated = formatDate(meta.updated_at) || '';
    const budget = get(data, 'budget', []).reduce((a, b) => a + get(b, 'fund.amount', 0), 0);

    const allProjects = get(this.props.api, 'projects', []);

    const sdsGoals = get(data, 'sds_indicator').join(',');
    const relatedProjects = allProjects.filter(function (project) {
      if (meta.id === project.id) { return false; } // don't include itself
      for (let i = 0; i < project.sds_indicators.length; ++i) {
        if (sdsGoals.indexOf(project.sds_indicators[i]) >= 0) {
          return true;
        }
      }
      return false;
    });

    // All three project comparison charts need to have the same ordering in the Y axis,
    // so don't do any more sorting after the budget map.
    const budgets = allProjects.map((project) => ({
      name: project.name,
      value: get(project, 'budget', []).reduce((a, b) => a + get(b, 'fund.amount', 0), 0),
      link: path.resolve(basepath, 'projects', project.id),
      project: project
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const completion = budgets.map((d) => ({
      name: d.name,
      link: d.link,
      value: ProjectCard.percentComplete(d.project)
    }));

    const served = budgets.map((d) => ({
      name: d.name,
      link: d.link,
      value: +get(d.project, 'number_served.number_served', 0)
    }));

    const donors = get(data, 'budget', []).map((donor) => ({
      name: donor.donor_name,
      link: path.resolve(basepath, 'donor', slugify(donor.donor_name)),
      value: donor.fund.amount
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const disbursement = get(data, 'disbursed', []).map((fund) => ({
      name: parseProjectDate(fund.date),
      type: fund.type.split(' ')[0],
      value: fund.fund.amount
    })).sort((a, b) => a.name > b.name ? 1 : -1).map((d) => ({
      name: formatDate(d.name) + ' (' + d.type + ')',
      value: d.value
    }));

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><button className='button button--medium button--primary button--download'>Download</button></li>
                  <li><Share path={this.props.location.pathname}/></li>
                </ul>
              </div>
              <dl className={'inpage-meta project--' + (ontime ? 'ontime' : 'delayed')}>
                <dt className='inpage-meta__label visually-hidden'>Status</dt>
                <dd className='inpage-meta__value inpage-meta__value--status'>{ontime ? 'On time' : 'Delayed'}</dd>
                <dt className='inpage-meta__label'>Last Update: </dt>
                <dd className='inpage-meta__value'>&nbsp;{lastUpdated}</dd>
              </dl>
              <h1 className='inpage__title heading--deco heading--large'>{meta.name}</h1>
            </div>
            <ProjectTimeline project={data} />

            <div className='tags'>
              <div className='tags__group'>
                <p className='tags__label'>Categories:</p>
                <div className='inpage__subtitles'>
                  {get(data, 'category', []).map((category) => <span key={category} className='inpage__subtitle'>
                    <Link to={linkPath(basepath, 'category', category)} className='link--secondary' href=''>{category}</Link>&nbsp;
                  </span>)}
                </div>
              </div>
              <div className='tags__group'>
                <p className='tags__label'>Donors:</p>
                <div className='inpage__subtitles'>
                  {donors.map((donor) => <span key={donor.name} className='inpage__subtitle'>
                      <Link to={linkPath(basepath, 'donor', donor.name)} className='link--secondary' href=''>{donor.name}</Link>&nbsp;
                    </span>)}
                </div>
              </div>
            </div>

          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>
              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
                <Map />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li>${shortTally(budget)} <small>Funding</small></li>
                  <li>{tally(data.number_served.number_served)} <small>{data.number_served.number_served_unit}</small></li>
                </ul>

                <div className='inpage__overview-links'>
                  <h2 className='overview-item__title heading-alt'>Objective</h2>
                  <ul>
                    <li>{data.description}</li>
                  </ul>

                <div className='overview-item'>
                  <h1 className='overview-item__title heading-alt'>Location</h1>
                  <ul className='link-list'>
                    {get(data, 'location', []).map((loc, i) => {
                      const id = loc.district.district && loc.district.district.toLowerCase() !== 'all'
                        ? loc.district.district : loc.district.governorate;
                      const display = byId(id);
                      return (
                        <li key={id}>
                          <span>{display ? display.name : '--'}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Project Link</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Source</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Responsible Party</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Responsible Party</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Responsible Party</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>{data.responsible_ministry}</span></a></li>
                  </ul>
                </div>

                <div className='overview-item--alt'>
                  <h2 className='overview-item__title heading-alt'>SDG Indicator</h2>
                  <ul className='link-list'>
                    {get(data, 'sdg_indicator', []).map((indicator, i) => {
                      return (
                        <li key={indicator}>
                          <span>{indicator}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='overview-item--alt'>
                  <h2 className='overview-item__title heading-alt'>SDS Indicator</h2>
                  <ul className='link-list'>
                    {get(data, 'sds_indicator', []).map((indicator, i) => {
                      return (
                        <li key={indicator}>
                          <span>{indicator}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                </div>
              </div>
            </section>
            <section className='inpage__section inpage__section--charts'>

              <div className='overview-charts'>
                <div className={'chart-content chart__inline--labels' + (!authenticated ? ' chart__block' : '')}>
                  <h3>Funding by Donor</h3>
                  <HorizontalBarChart
                    data={donors}
                    margin={barChartMargin}
                    yTitle=''
                    xFormat={shortTally}
                  />
                </div>
                {authenticated ? (
                  <div className='chart-content chart__inline--labels'>
                    <h3>Disbursement vs. Reach</h3>
                    <VerticalBarChart
                      data={disbursement}
                      margin={barChartMargin}
                      yTitle=''
                      yFormat={shortTally}
                    />
                  </div>
                ) : null}
              </div>

            </section>
            <section className='inpage__section inpage__section--indicators'>
              <h1 className='section__title heading--small'>Monitoring Indicators</h1>
              {Array.isArray(data.kmi) && (
                <table className='inpage__table'>
                  <thead>
                    <tr>
                      <th className='row-status'>Status</th>
                      <th className='row-name'>Component</th>
                      <th className='row-kpi'>KPI</th>
                      <th className='row-target'>Target</th>
                      <th className='row-progress'>Progress</th>
                      <th className='row-date'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kmi.map((d) => {
                      const status = d.status.toLowerCase() === 'implemented' ? 'ontime' : 'delayed';
                      return (
                        <tr key={d.kpi}>
                          <td className={'project--' + status}>
                            <p className='card-meta__value--status activity-name'>{ontime ? 'On time' : 'Delayed'}</p>
                          </td>
                          <td className='cell-name'>{d.component}</td>
                          <td>{d.kpi}</td>
                          <td>{d.target}</td>
                          <td>{d.current}</td>
                          <td>{formatDate(parseProjectDate(d.date))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
            <section className='inpage__section inpage__section--comparison'>
              <h1 className='section__title heading--small'>Project Comparison By Category</h1>
              <div className='chart-content chart__inline--labels'>
                <h3>Funding</h3>
                <HorizontalBarChart
                  data={budgets}
                  margin={barChartMargin}
                  yTitle=''
                  xFormat={shortTally}
                  yFormat={shortText}
                />
              </div>
              <div className='chart-content chart__inline--labels'>
                <h3>Percentage Complete</h3>
                <HorizontalBarChart
                  data={completion}
                  margin={barChartMargin}
                  yTitle=''
                  xFormat={pct}
                  yFormat={shortText}
                />
              </div>
              {authenticated ? (
                <div className='chart-content chart__inline--labels'>
                  <h3>Reach</h3>
                  <HorizontalBarChart
                    data={served}
                    margin={barChartMargin}
                    yTitle=''
                    xFormat={tally}
                    yFormat={shortText}
                  />
                </div>
              ) : null}
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--small'>Related Projects By SDS Goal</h1>
              <ul className='projects-list'>
                {relatedProjects.map((p) => {
                  return (
                    <li key={p.id}
                      className='projects-list__card'>
                      <ProjectCard
                        lang={this.props.meta.lang}
                        project={p}
                      />
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

module.exports = connect(mapStateToProps)(Project);
