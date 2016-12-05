'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import { tally, shortTally, pct, shortText } from '../utils/format';
import slugify from '../utils/slugify';

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

    // Count number of projects per category
    const justCategories = projects.map((project) => {
      let budget = project.budget.reduce((cur, item) => cur + get(item, 'fund.amount', 0), 0);
      return get(project, 'categories', []).map((category) => {
        return { category, budget };
      });
    }).reduce((a, b) => a.concat(b), []);

    let numProjectsPerCategory = {};
    let budgetPerCategory = {};
    justCategories.forEach((categoryObj) => {
      const {category, budget} = categoryObj;
      if (category in numProjectsPerCategory) {
        numProjectsPerCategory[category] += 1;
      } else {
        numProjectsPerCategory[category] = 1;
      }

      if (category in budgetPerCategory) {
        budgetPerCategory[category] += budget;
      } else {
        budgetPerCategory[category] = budget;
      }
    });

    const numProjectsChartData = Object.keys(numProjectsPerCategory).map((key) => {
      return {
        name: key,
        value: numProjectsPerCategory[key]
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const budgetPerCategoryChartData = Object.keys(budgetPerCategory).map((key) => {
      return {
        name: key,
        value: budgetPerCategory[key]
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const categoryName = this.props.params.name;
    let categoryDisplayName;

    const categoryProjects = projects.filter((project) => {
      return get(project, 'categories', []).some((item) => {
        let sluggedName = slugify(item);
        if (sluggedName === categoryName) {
          categoryDisplayName = item;
        }
        return sluggedName === categoryName;
      });
    });

    const categoryBudgets = categoryProjects
      .map((project) => project.budget)
      .reduce((a, b) => a.concat(b), []);

    const chartData = categoryProjects.map((project) => {
      return {
        name: project.name,
        value: project.budget.reduce((cur, item) => cur + item.fund.amount, 0),
        project: project
      };
    }).sort((a, b) => b.value > a.value ? -1 : 1);

    const completion = chartData.map((d, i) => ({
      name: d.name,
      value: ProjectCard.percentComplete(d.project)
    }));

    const totalBudget = categoryBudgets.reduce((currentValue, budget) => {
      return budget.fund.amount + currentValue;
    }, 0);

    const singleProject = categoryProjects.length <= 1 ? ' category--single' : '';

    return (
      <section className='inpage category'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><button className='button button--medium button--primary button--download'>Download</button></li>
                  <li><Share path={this.props.location.pathname}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{categoryDisplayName}</h1>
            </div>
            <div className='inpage__header-data'>
              <ul className='inpage-stats'>
                <li> {shortTally(totalBudget)} <small>Total Funds</small></li>
                <li> {tally(categoryProjects.length)} <small>{singleProject ? 'Project' : 'Projects'} Funded</small></li>
              </ul>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <div className='inner'>
            <Map />
            <section className='inpage__section'>
              <h1 className='section__title heading--small'>Comparison</h1>
              <div className='chart-content chart__inline--labels'>
                <h3>Number of Projects per Category</h3>
                <HorizontalBarChart
                  data={numProjectsChartData}
                  yFormat={shortText}
                  margin={chartMargin}
                />
              </div>
              <div className='chart-content chart__inline--labels'>
                <h3>Funding of Projects per Category</h3>
                <HorizontalBarChart
                  data={budgetPerCategoryChartData}
                  margin={chartMargin}
                  yFormat={shortText}
                  xFormat={shortTally}
                />
              </div>
            </section>
            <section className='inpage__section'>
              <h1 className='section__title heading--small'>Projects</h1>
              <div className='chart-content chart__inline--labels'>
                {!singleProject && (<h3>Funding</h3>)}
                 {!singleProject && (<HorizontalBarChart
                 data={chartData}
                 margin={chartMargin}
                 xFormat={shortTally}
                 yFormat={shortText}
                />)}
               </div>
               <div className='chart-content chart__inline--labels'>
                {!singleProject && (<h3>Percentage Complete</h3>)}
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

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(Category);
