'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import path from 'path';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import Print from '../components/print-btn';
import { tally, shortTally, pct, shortText, currency } from '../utils/format';
import slugify from '../utils/slugify';
import { GOVERNORATE, getProjectCentroids, getFeatureCollection } from '../utils/map-utils';
import { window } from 'global';

const chartMargin = { left: 150, right: 20, top: 10, bottom: 50 };

var Category = React.createClass({
  displayName: 'Category',

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
    // hold onto the mappings between category key (english name) and
    // the object holding both english and arabic name strings.
    const categoryNames = {};
    // Count number of projects per category
    const justCategories = projects.map((project) => {
      let budget = project.budget.reduce((cur, item) => cur + get(item, 'fund.amount', 0), 0);
      return get(project, 'categories', []).map((category) => {
        let key = category.en;
        categoryNames[key] = category;
        return { key, budget };
      });
    }).reduce((a, b) => a.concat(b), []);

    let numProjectsPerCategory = {};
    let budgetPerCategory = {};
    justCategories.forEach((category) => {
      let { key } = category;
      numProjectsPerCategory[key] = numProjectsPerCategory[key] || 0;
      numProjectsPerCategory[key] += 1;
      budgetPerCategory[key] = budgetPerCategory[key] || 0;
      budgetPerCategory[key] += category.budget;
    });

    const numProjectsChartData = Object.keys(numProjectsPerCategory).map((key) => {
      return {
        name: key,
        link: path.resolve(basepath, 'category', slugify(key)),
        value: numProjectsPerCategory[key]
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const budgetPerCategoryChartData = Object.keys(budgetPerCategory).map((key) => {
      return {
        name: key,
        link: path.resolve(basepath, 'category', slugify(key)),
        value: budgetPerCategory[key]
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const categoryName = this.props.params.name;
    let categoryDisplayName;

    // find all projects with this particular category
    const categoryProjects = projects.filter((project) => {
      return get(project, 'categories', []).find((item) => {
        let sluggedName = slugify(item.en);
        if (sluggedName === categoryName) {
          categoryDisplayName = item[lang];
          return true;
        }
        return false;
      });
    });

    const markers = getProjectCentroids(categoryProjects, get(this.props.api, 'geography.' + GOVERNORATE + '.features'));
    const mapLocation = getFeatureCollection(markers);

    const categoryBudgets = categoryProjects
      .map((project) => project.budget)
      .reduce((a, b) => a.concat(b), []);

    const chartData = categoryProjects.map((project) => ({
      name: project.name,
      link: path.resolve(basepath, 'projects', project.id),
      value: project.budget.reduce((cur, item) => cur + item.fund.amount, 0),
      project
    })).sort((a, b) => b.value > a.value ? -1 : 1);

    const completion = chartData.map((d, i) => ({
      name: d.name,
      link: d.link,
      value: ProjectCard.percentComplete(d.project)
    }));

    const totalBudget = categoryBudgets.reduce((currentValue, budget) => {
      return budget.fund.amount + currentValue;
    }, 0);

    const singleProject = categoryProjects.length <= 1 ? ' category--single' : '';
    const t = get(window.t, [this.props.meta.lang, 'category_pages'], {});
    return (
      <section className='inpage category'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><Print lang={this.props.meta.lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={this.props.meta.lang}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{categoryDisplayName}</h1>
            </div>
            <div className='inpage__header-data'>
              <ul className='inpage-stats'>
                <li> {currency(shortTally(totalBudget))} <small>{t.stat_one}</small></li>
                <li> {tally(categoryProjects.length)} <small>{singleProject ? t.cat_stats_funded_1 : t.cat_stats_funded_2} {t.cat_stats_funded_3}</small></li>
              </ul>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <div className='inner'>
            <Map markers={markers} location={mapLocation} />
            <section className='inpage__section'>
              <h1 className='section__title heading--small'>{t.comparison_title}</h1>
              <div className='chart-content chart__inline--labels'>
                <h3>{t.comparison_chart_title1}</h3>
                <HorizontalBarChart
                  lang={this.props.meta.lang}
                  data={numProjectsChartData}
                  yFormat={shortText}
                  margin={chartMargin}
                  activeProject={categoryDisplayName}
                />
              </div>
              <div className='chart-content chart__inline--labels'>
                <h3>{t.comparison_chart_title2}</h3>
                <HorizontalBarChart
                  data={budgetPerCategoryChartData}
                  margin={chartMargin}
                  yFormat={shortText}
                  xFormat={shortTally}
                  activeProject={categoryDisplayName}
                />
              </div>
            </section>
            <section className='inpage__section'>
              <h1 className='section__title heading--small'>{categoryDisplayName} {t.projects_parttitle}</h1>
              <div className='chart-content chart__inline--labels'>
                {!singleProject && (<h3>{t.category_funding_chart_title}</h3>)}
                {!singleProject && (<HorizontalBarChart
                 data={chartData}
                 margin={chartMargin}
                 xFormat={shortTally}
                 yFormat={shortText}
                />)}
               </div>
               <div className='chart-content chart__inline--labels'>
                {!singleProject && (<h3>{t.category_complete_chart_title}</h3>)}
                {!singleProject && (<HorizontalBarChart
                  data={completion}
                  margin={chartMargin}
                  yTitle=''
                  xFormat={pct}
                  yFormat={shortText}
                />)}
              </div>
              <ul className='projects-list'>
                {categoryProjects.map((p) => {
                  return (
                    <li key={p.id} className='projects-list__card'>
                      <ProjectCard lang={this.props.meta.lang}
                        project={p} />
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </section>
    );
  }
});

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(Category);
