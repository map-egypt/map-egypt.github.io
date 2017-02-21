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
import { tally, shortTally, pct, shortText, ontimeLookup, currency } from '../utils/format';
import { hasValidToken } from '../utils/auth';
import { getProjectCentroids, getFeatureCollection } from '../utils/map-utils';
import getLocation from '../utils/location';
import { window } from 'global';

import Map from '../components/map';
import Share from '../components/share';
import ProjectCard from '../components/project-card';
import ProjectTimeline from '../components/project-timeline';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import Print from '../components/print-btn';
import CSVBtn from '../components/csv-btn';

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

    // put id on project data object since it's missing from the project detail endpoint.
    data.id = meta.id;
    const { lang } = this.props.meta;
    const basepath = '/' + lang;
    const ontime = ProjectCard.isOntime(data);
    const lastUpdated = formatDate(meta.updated_at) || '';
    const budget = get(data, 'budget', []).reduce((a, b) => a + get(b, 'fund.amount', 0), 0);

    const disbursedFunds = {loan: 0, grant: 0};
    get(data, 'disbursed', []).forEach((fund) => {
      disbursedFunds[fund.type.en.toLowerCase()] += fund.fund.amount;
    });

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
    const markers = getProjectCentroids([data], this.props.api.geography);
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
      donor: fund.donor_name,
      type: fund.type[lang],
      value: fund.fund.amount
    })).sort((a, b) => a.name > b.name ? 1 : -1).map((d, i) => ({
      name: `${d.donor} - ${formatDate(d.name)} (${d.type})`,
      value: d.value
    }));

    const t = get(window.t, [this.props.meta.lang, 'project_pages'], {});

    const csvChartData = [
      {
        title: 'Funding By Donor (US Dollars)',
        data: donors
      },
      {
        title: 'Funding By Category',
        data: budgets
      },
      {
        title: 'Percentage Complete By Category',
        data: completion
      },
      {
        title: 'Beneficiaries Reached By Category',
        data: served
      }
    ];

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><CSVBtn
                      title={data.name}
                      relatedProjects={relatedProjects}
                      project={data}
                      chartData={csvChartData}
                      disbursement={disbursement}
                      kmiData={data.kmi}
                      lang={this.props.meta.lang} /></li>
                  <li><Print lang={this.props.meta.lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={this.props.meta.lang}/></li>
                </ul>
              </div>
              <dl className={'inpage-meta project--' + ontime}>
                <dt className='inpage-meta__label visually-hidden'>Type</dt>
                {ontime !== 'closed'
                  ? <dd className='inpage-meta__value inpage-meta__value--type'>{data.status[lang]}</dd>
                  : ''}
                <dt className='inpage-meta__label visually-hidden'></dt>
                <dd className='inpage-meta__value inpage-meta__value--status'>{ontimeLookup(ontime, lang)}</dd>
                <dt className='inpage-meta__label'>{t.last_update_title}: </dt>
                <dd className='inpage-meta__value'>&nbsp;{lastUpdated}</dd>
              </dl>
              <h1 className='inpage__title heading--deco heading--large'>{meta.name}</h1>
            </div>
            <ProjectTimeline project={data} lang={this.props.meta.lang}/>

            <div className='tags'>
              <div className='tags__group'>
                <p className='tags__label'>{t.categories_title}:</p>
                <div className='inpage__subtitles'>
                  {get(data, 'category', []).map((category) => <span key={category.en} className='inpage__subtitle'>
                    <Link to={linkPath(basepath, 'category', category.en)} className='link--secondary' href=''>{category[lang]}</Link>&nbsp;
                  </span>)}
                </div>
              </div>
              <div className='tags__group'>
                <p className='tags__label'>{t.donors_title}:</p>
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
                <Map markers={markers} location={mapLocation} lang={lang} />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li>{currency(shortTally(budget))} <small>{t.funding_title}</small></li>
                  <li>{tally(data.number_served.number_served)} <small>{data.number_served.number_served_unit}</small></li>
                </ul>
                {disbursedFunds.loan || disbursedFunds.grant
                  ? <ul className='inpage-stats'>
                      {disbursedFunds.loan
                        ? <li>{currency(shortTally(disbursedFunds.loan))} <small>{t.funding_loans_title}</small></li>
                        : ''}
                      {disbursedFunds.grant
                        ? <li>{currency(shortTally(disbursedFunds.grant))} <small>{t.funding_grants_title}</small></li>
                        : ''}
                    </ul>
                  : ''}
                <div className='inpage__overview-links'>
                <h2 className='overview-item__title heading-alt'>{t.objective_title}</h2>
                <ul>
                  <li>{data.description}</li>
                </ul>
                {data.location && (
                  <div className='overview-item'>
                    <h1 className='overview-item__title heading-alt'>{t.location_title}</h1>
                    <div className='link-list'>
                       {get(data, 'location', []).map((loc, i) => {
                         const location = getLocation(loc, lang);
                         if (location) {
                           const display = location.display;
                           return (
                             <span key={location.id}>
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
                    <h2 className='overview-item__title heading-alt'>{t.project_link}</h2>
                    <ul className='link-list'>
                      <li><a href={data.project_link} className='link--primary'><span>{t.view_documentation_title}</span></a></li>
                    </ul>
                  </div>
                )}

                {data.responsible_ministry && (
                  <div className='overview-item'>
                    <h2 className='overview-item__title heading-alt'>{t.responsible_ministry_title}</h2>
                    <ul className='link-list'>
                      <li><a href={`#/${lang}/ministry/${slugify(data.responsible_ministry[lang])}`} className='link--primary'><span>{data.responsible_ministry[lang]}</span></a></li>
                    </ul>
                  </div>
                )}

                {((lang === 'en' && data.local_manager) || lang === 'ar' && data.local_manager_ar) && (
                  <div className='overview-item'>
                    <h2 className='overview-item__title heading-alt'>{t.local_manager_title}</h2>
                    <ul className='link-list'>
                      <li><a href={`#/${lang}/owner/${slugify(data.local_manager)}`} className='link--primary'><span>{lang === 'en' ? data.local_manager : data.local_manager_ar}</span></a></li>
                    </ul>
                  </div>
                )}

                {data.kmi && (
                  <div className='overview-item--alt'>
                    <h2 className='overview-item__title heading-alt'>{t.kmi_components}</h2>
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

                {data.sdg_indicator && (
                  <div className='overview-item--alt'>
                    <h2 className='overview-item__title heading-alt'>{t.sdg_goals_title}</h2>
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
                    <h2 className='overview-item__title heading-alt'>{t.sds_pillars_title}</h2>
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
                  <h3>{t.funding_by_donor_title}</h3>
                  <HorizontalBarChart
                    lang={this.props.meta.lang}
                    data={donors}
                    margin={barChartMargin}
                    yTitle=''
                    xFormat={shortTally}
                  />
                </div>
                {authenticated && disbursement.length ? (
                  <div className='chart-content chart__inline--labels'>
                    <h3>Disbursement vs. Reach</h3>
                    <HorizontalBarChart
                      data={disbursement}
                      margin={barChartMargin}
                      yTitle=''
                      xFormat={shortTally}
                      lang={this.props.meta.lang}
                    />
                  </div>
                ) : null}
              </div>

            </section>
            {Array.isArray(data.kmi) && data.kmi.length && (
              <section className='inpage__section inpage__section--indicators'>
                <h1 className='section__title heading--small'>{t.monitoring_indicators_title}</h1>
                <table className='inpage__table'>
                  <thead>
                    <tr>
                      <th className='row-status'>{t.status_title}</th>
                      <th className='row-name'>{t.component_title}</th>
                      <th className='row-kpi'>{t.kpi_title}</th>
                      <th className='row-target'>{t.target_title}</th>
                      <th className='row-progress'>{t.rate_title}</th>
                      <th className='row-date'>{t.date_title}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kmi.map((d) => {
                      const key = slugify(d.status.en);
                      return (
                        <tr key={d.kpi}>
                          <td className={'project--' + key}>
                            <p className='activity-name'>{d.status[lang]}</p>
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
              <h1 className='section__title heading--small'>{t.project_comparison_title}</h1>
              <div className='chart-content chart__inline--labels'>
                <h3>{t.comparison_chart_title1}</h3>
                <HorizontalBarChart
                  lang={this.props.meta.lang}
                  data={budgets}
                  margin={barChartMargin}
                  yTitle=''
                  xFormat={shortTally}
                  yFormat={shortText}
                  activeProject={meta.name}
                />
              </div>
              <div className='chart-content chart__inline--labels'>
                <h3>{t.comparison_chart_title2}</h3>
                <HorizontalBarChart
                  lang={this.props.meta.lang}
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
                  <h3>{t.comparision_chart_title3}</h3>
                  <HorizontalBarChart
                    lang={this.props.meta.lang}
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
              <h1 className='section__title heading--small'>{t.related_sds_projects_title}</h1>
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
