'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { uniq } from 'lodash';
import { getProject } from '../actions';
import slugify from '../utils/slugify';
import { formatDate, formatSimpleDate, parseProjectDate } from '../utils/date';
import { tally, shortTally, pct, shortText } from '../utils/format';
import { byId as districtNames } from '../utils/districts';
import { byId as governorateNames } from '../utils/governorates';
import { hasValidToken } from '../utils/auth';
import { GOVERNORATE, getProjectCentroids, getFeatureCollection } from '../utils/map-utils';

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
    meta: React.PropTypes.object,
    lang: React.PropTypes.string
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
    } else if (props.params.id !== this.props.params.id) {
      this.props.dispatch(getProject(props.params.id));
    }
  },

  render: function () {
    const authenticated = this.props.api.authenticated;
    const meta = get(this.props.api, ['projectDetail', this.props.params.id]);
    if (!meta) {
      return <div></div>; // TODO loading indicator
    }
    const data = meta.data;
    const { lang } = this.props.meta;
    const basepath = '/' + lang;
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

    // Create map markers for this project
    const markers = getProjectCentroids([data], get(this.props.api, 'geography.' + GOVERNORATE + '.features'));
    const mapLocation = getFeatureCollection(markers);

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
      type: fund.type[lang],
      value: fund.fund.amount
    })).sort((a, b) => a.name > b.name ? 1 : -1).map((d) => ({
      name: formatDate(d.name) + ' (' + d.type + ')',
      value: d.value
    }));

    const locationLang = this.props.meta.lang === 'en' ? 'name' : 'nameAr';

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
                  {get(data, 'category', []).map((category) => <span key={category.en} className='inpage__subtitle'>
                    <Link to={linkPath(basepath, 'category', category.en)} className='link--secondary' href=''>{category[lang]}</Link>&nbsp;
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
                <Map markers={markers} location={mapLocation} />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li>${shortTally(budget)} <small>Funding</small></li>
                  <li>{tally(data.number_served.number_served)} <small>{data.number_served.number_served_unit}</small></li>
                </ul>

                <div className='inpage__overview-links'>
                {data.description && (
                  <div>
                    <ul>
                      <li>{data.description}</li>
                    </ul>
                  </div>
                )}
                {data.location && (
                  <div className='overview-item'>
                    <h1 className='overview-item__title heading-alt'>Location</h1>
                    <div className='link-list'>
                       {get(data, 'location', []).map((loc, i) => {
                         const id = loc.district.district && loc.district.district.toLowerCase() !== 'all'
                           ? districtNames(loc.district.district) : governorateNames(loc.district.governorate);
                         if (id) {
                           const display = id[locationLang];
                           return (
                             <span key={id.id}>
                               <span>{display || '--'}{i === data.location.length - 1 ? '' : ', '}</span>
                             </span>
                           );
                         }
                       })}
                    </div>
                  </div>
                )}

                {data.project_link && (
                  <div className='overview-item'>
                    <h2 className='overview-item__title heading-alt'>Project Link</h2>
                    <ul className='link-list'>
                      <li><a href={data.project_link} className='link--primary'><span>Link</span></a></li>
                    </ul>
                  </div>
                )}

                {data.responsible_ministry && (
                  <div className='overview-item'>
                    <h2 className='overview-item__title heading-alt'>Responsible Ministry</h2>
                    <ul className='link-list'>
                      <li><a href={`#/${lang}/ministry/${slugify(data.responsible_ministry[lang])}`} className='link--primary'><span>{data.responsible_ministry[lang]}</span></a></li>
                    </ul>
                  </div>
                )}

                {((lang === 'en' && data.local_manager) || lang === 'ar' && data.local_manager_ar) && (
                  <div className='overview-item'>
                    <h2 className='overview-item__title heading-alt'>Local Manager</h2>
                    <ul className='link-list'>
                      <li><a href='' className='link--primary'><span>{lang === 'en' ? data.local_manager : data.local_manager_ar}</span></a></li>
                    </ul>
                  </div>
                )}

                {data.kmi.length && (
                  <div className='overview-item--alt'>
                    <h2 className='overview-item__title heading-alt'>KMI Components</h2>
                    <ul className='link-list'>
                      {uniq(get(data, 'kmi', []).map((kmi) => kmi.component.trim())).map(component => {
                        return (
                          <li key={component}>
                            <span>{component}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {data.sdg_indicator.length && (
                  <div className='overview-item--alt'>
                    <h2 className='overview-item__title heading-alt'>SDG Goals</h2>
                    <ul className='link-list'>
                      {get(data, 'sdg_indicator', []).map((indicator) => {
                        return (
                          <li key={indicator.en}>
                            <span>{indicator[lang]}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {data.sds_indicator && (
                  <div className='overview-item--alt'>
                    <h2 className='overview-item__title heading-alt'>SDS Pillars</h2>
                    <ul className='link-list'>
                      {get(data, 'sds_indicator', []).map((indicator) => {
                        return (
                          <li key={indicator.en}>
                            <span>{indicator[lang]}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

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
                {authenticated && disbursement.length ? (
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
            {Array.isArray(data.kmi) && data.kmi.length && (
              <section className='inpage__section inpage__section--indicators'>
                <h1 className='section__title heading--small'>Monitoring Indicators</h1>
                <table className='inpage__table'>
                  <thead>
                    <tr>
                      <th className='row-status'>Status</th>
                      <th className='row-name'>Component</th>
                      <th className='row-kpi'>Key Performance Indicator</th>
                      <th className='row-target'>Target</th>
                      <th className='row-progress'>Progress</th>
                      <th className='row-date'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kmi.map((d) => {
                      const key = slugify(d.status.en);
                      return (
                        <tr key={d.kpi}>
                          <td className={'project--' + key}>
                            <p className='card-meta__value--status activity-name'>{d.status[lang]}</p>
                          </td>
                          <td className='cell-name'>{d.component}</td>
                          <td>{d.kpi}</td>
                          <td>{tally(d.target)}</td>
                          <td>{tally(d.current)}</td>
                          <td>{formatSimpleDate(parseProjectDate(d.date))}</td>
                        </tr>
                        );
                    })}
                  </tbody>
                </table>
              </section>
            )}
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
                  activeProject={meta.name}
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
                  activeProject={meta.name}
                />
              </div>
              {authenticated ? (
                <div className='chart-content chart__inline--labels'>
                  <h3>Beneficiaries Reached</h3>
                  <HorizontalBarChart
                    data={served}
                    margin={barChartMargin}
                    yTitle=''
                    xFormat={tally}
                    yFormat={shortText}
                    activeProject={meta.name}
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
