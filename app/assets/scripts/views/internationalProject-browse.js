'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { clone } from 'lodash';
import ReactTooltip from 'react-tooltip';

import Map from '../components/map';
import Print from '../components/print-btn';
import CSVBtn from '../components/csv-btn';
import ProjectList from '../components/project-list';
import AutoSuggest from '../components/auto-suggest';
import { isOntime } from '../components/project-card';
import { governorates } from '../utils/governorates';
import { GOVERNORATE, DISTRICT, getProjectCentroids } from '../utils/map-utils';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import { window } from 'global';

const PROJECTS = 'projects';
const barChartMargin = { left: 75, right: 20, top: 10, bottom: 50 };

function countByProp (array, path) {
  const result = {};
  array.forEach((item) => {
    const name = path ? get(item, path, '--') : item;
    result[name] = result[name] || 0;
    result[name] += 1;
  });
  return result;
}

// Sort function for indicators names.
// First checks if there is a digit, ie. `Pillar 1`.
// Otherwise sorts alphabetically.

// Project filters
const STATUS = {
  translationPath: 'project_status',
  items: (projects, lang, t) => {
    return [
      { display: t.status_ontime, filter: isOntime },
      { display: t.status_delayed, filter: (p) => !isOntime(p) }
    ];
  }
};

const CATEGORY = {
  translationPath: 'category',
  items: (projects, lang) => {
    const categories = countByProp(projects.reduce((a, b) => a.concat(b.categories), []), lang);
    return Object.keys(categories).map((category) => ({
      display: `${category} (${categories[category]})`,
      filter: (p) => Array.isArray(p.categories) && p.categories.map(d => d[lang]).indexOf(category) >= 0
    }));
  }
};

const DONOR = {
  translationPath: 'donor',
  items: (projects, lang) => {
    const prop = lang === 'ar' ? 'donor_name_ar' : 'donor_name';
    const donors = countByProp(projects.reduce((a, b) => a.concat(b.budget), []), prop);
    return Object.keys(donors).map((donor) => ({
      display: `${donor} (${donors[donor]})`,
      filter: (p) => Array.isArray(p.budget) && p.budget.find((budget) => budget[prop] === donor)
    }));
  }
};

const SDS = {
  translationPath: 'sds_goals',
  items: (projects, lang) => {
    const goals = countByProp(projects.reduce((a, b) => a.concat(b.sds_indicators), []), lang);
    return Object.keys(goals).sort().map((goal) => ({
      display: `${goal} (${goals[goal]})`,
      filter: (p) => Array.isArray(p.sds_indicators) && p.sds_indicators.map(d => d[lang]).indexOf(goal) >= 0
    }));
  }
};

const SDG = {
  translationPath: 'sdg_goals',
  items: (projects, lang) => {
    const goals = countByProp(projects.reduce((a, b) => a.concat(b.sdg_indicators), []), lang);
    return Object.keys(goals).map((goal) => goal).sort().map((goal) => ({
      display: `${goal} (${goals[goal]})`,
      filter: (p) => Array.isArray(p.sdg_indicators) && p.sdg_indicators.map(d => d[lang]).indexOf(goal) >= 0
    }));
  }
};

const projectFilters = [STATUS, CATEGORY, DONOR, SDS, SDG];

var InternationalProjectBrowse = React.createClass({
  displayName: 'InternationalProjectBrowse',

  getInitialState: function () {
    return {

      // modal open or closed
      modal: false,

      // which modal (projects or indicators)
      activeModal: null,

      // is the view set to list view or map
      listView: false,

      // which governorate are we zoomed into
      activeGovernorate: null,

      selectedProjectFilters: [],
      activeProjectFilters: [],

      projectsHidden: false
    };
  },

  propTypes: {
    api: React.PropTypes.object,
    meta: React.PropTypes.object,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    route: React.PropTypes.object
  },

  componentWillMount: function () {},

  componentDidUpdate: function () {
    ReactTooltip.rebuild();
  },

  componentWillUpdate: function (nextProps, nextState) {
    const modal = nextState.modal;
    if (modal) {
      document.documentElement.classList.add('disable--page-scroll');
    } else {
      document.documentElement.classList.remove('disable--page-scroll');
    }
  },

  zoomToGovernorate: function (event, value) {
    const selected = value.suggestion;
    this.setState({
      activeGovernorate: selected
    });
  },

  // project modal
  openProjectSelector: function () {
    this.setState({
      modal: true,
      activeModal: PROJECTS,
      selectedProjectFilters: this.state.activeProjectFilters.length ? clone(this.state.activeProjectFilters) : []
    });
  },

  cancelFilters: function () {
    this.setState({
      modal: false,
      selectedProjectFilters: this.state.activeProjectFilters.length ? clone(this.state.activeProjectFilters) : []
    });
  },

  confirmFilters: function () {
    this.setState({
      modal: false,
      activeProjectFilters: this.state.selectedProjectFilters.length ? clone(this.state.selectedProjectFilters) : []
    });
  },

  resetProjectFilters: function () {
    this.setState({
      selectedProjectFilters: []
    });
  },

  clearProjectFilters: function () {
    this.setState({
      selectedProjectFilters: [],
      activeProjectFilters: []
    });
  },

  toggleSelectedFilter: function (filter) {
    let selected = this.state.selectedProjectFilters;
    let index = selected.map((f) => f.display).indexOf(filter.display);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected = selected.concat([filter]);
    }
    this.setState({
      selectedProjectFilters: selected
    });
  },

  removeActiveFilter: function (filter) {
    let active = this.state.activeProjectFilters;
    let index = active.map((f) => f.display).indexOf(filter.display);
    active.splice(index, 1);
    this.setState({
      activeProjectFilters: active
    });
  },

  toggleProjects: function () {
    this.setState({
      projectsHidden: !this.state.projectsHidden,
      selectedProjectFilters: [],
      activeProjectFilters: []
    });
  },

  closeModal: function () {
    this.setState({ modal: false, activeModal: null });
  },

  selectListView: function () { this.setState({ listView: true }); },
  selectMapView: function () { this.setState({ listView: false }); },

  createOverlay: function (indicatorData) {
    if (!indicatorData) { return null; }
    const { id, data } = indicatorData;
    const overlay = {
      id,
      category: data.category,
      units: data.units
    };

    // if we have an external mapbox id, skip the other checks
    if (typeof data.data === 'string') {
      overlay.mapid = data.data;
      return overlay;
    } else {
      // Indicators have a data_geography property, type boolean.
      // true = governorate, false = district.
      // Default to governorates if no property exists.
      let adminLevel = (!data.hasOwnProperty('data_geography') ||
                        data.data_geography) ? GOVERNORATE : DISTRICT;
      const regions = get(this.props.api, 'geography.' + adminLevel);
      if (regions) {
        overlay.values = data.data.map((d) => ({
          id: d.sub_nat_id,
          value: d.data_value
        })).filter(d => typeof d.value !== 'undefined');
        overlay.regions = regions;
        return overlay;
      }
    }
    return null;
  },

  renderProjectSelector: function () {
    let projects = this.props.api.InternationalProjects;
    let { lang } = this.props.meta;
    const { selectedProjectFilters } = this.state;
    const t = get(window.t, [lang, 'projects_indicators'], {});

    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__projects'>
          <h1 className='inpage__title heading--deco heading--medium'>{t.add_and_filter}</h1>
          <div className='modal__filters'>
            <div className='modal__filters--defaults'>
              <label className='form__option form__option--custom-checkbox'>
                <input
                  checked={!this.state.projectsHidden}
                  type='checkbox'
                  name='form-checkbox'
                  id='form-checkbox-1'
                  onChange={this.toggleProjects}
                  value='All projects' />
                <span className='form__option__text'>{t.all_projects}</span>
                <span className='form__option__ui'></span>
              </label>
              <a onClick={this.resetProjectFilters} className='link--secondary'>{t.reset_filters}</a>
            </div>

            {projectFilters.map((filter) => (

              <fieldset key={filter.translationPath}
                className='form__fieldset'>

                 <label className='form__label'>{t[filter.translationPath]}</label>
                 <div className='form__group'>
                   {filter.translationPath == 'sdg_goals'
                       ? (Array.isArray(filter.items) ? filter.items : filter.items(projects, lang, t)).sort(((a, b) => {
                         let digitRegex = /\d+/g;
                         const aIndex = digitRegex.exec(a.display)[0];
                         digitRegex.lastIndex = 0;
                         const bIndex = digitRegex.exec(b.display)[0];
                         return parseInt(aIndex) > parseInt(bIndex) ? 1 : -1;
                       })).map((item) => (
                           <label key={item.display}
                                  className={`form__option form__option--custom-checkbox ${this.state.projectsHidden ? 'disabled' : ''}`}>
                             <input
                                 checked={!!selectedProjectFilters.find((f) => f.display === item.display)}
                                 type='checkbox'
                                 name='form-checkbox'
                                 value={item.display}
                                 onChange={() => this.toggleSelectedFilter(item)}
                             />
                             <span className='form__option__text'>{item.display}</span>
                             <span className='form__option__ui'></span>
                           </label>
                       ))
                       : (Array.isArray(filter.items) ? filter.items : filter.items(projects, lang, t)).sort((a, b) => {
                         return a.display < b.display ? -1 : 1;
                       }).map((item) => (
                           <label key={item.display}
                                  className={`form__option form__option--custom-checkbox ${this.state.projectsHidden ? 'disabled' : ''}`}>
                             <input
                                 checked={!!selectedProjectFilters.find((f) => f.display === item.display)}
                                 type='checkbox'
                                 name='form-checkbox'
                                 value={item.display}
                                 onChange={() => this.toggleSelectedFilter(item)}
                             />
                             <span className='form__option__text'>{item.display}</span>
                             <span className='form__option__ui'></span>
                           </label>
                       ))}
                </div>
              </fieldset>
            ))}

            <ul className='button--list'>
              <li><button
                  onClick={this.confirmFilters}
                  type='button'
                  className='button button--medium button--primary'>{t.apply}</button></li>
              <li><button
                  onClick={this.cancelFilters}
                  type='button'
                  className='button button--medium button--primary-bounded'>{t.cancel}</button></li>
            </ul>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
        </div>
      </section>
    );
  },

  render: function () {
    const { lang } = this.props.meta;
    const selectedClassNames = 'button button--primary';
    const deselectedClassNames = 'button button--primary-bounded';

    let mapLocation;
    const governorateId = get(this.state, 'activeGovernorate.egy');
    if (governorateId) {
      const features = get(this.props.api, 'geography.' + GOVERNORATE + '.features', []);
      mapLocation = features.find((feature) => get(feature, 'properties.admin_id') === governorateId);
    }

    const { activeProjectFilters } = this.state;

    let projects = [];
    let markers = [];
    if (!this.state.projectsHidden) {
      projects = this.props.api.InternationalProjects;
      if (activeProjectFilters.length) {
        activeProjectFilters.forEach((filter) => {
          projects = projects.filter(filter.filter);
        });
      }
      markers = getProjectCentroids(projects, this.props.api.geography);
    }

    let overlay;
    let indicatorChartData;
    let csvCharts;

    const t = get(window.t, [lang, 'projects_indicators'], {});

    return (
      <section className='inpage project-browse'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
             <div className='inpage__headline-actions'>
                <ul>
                  <li><CSVBtn
                      title={t.International_projects_title}
                      relatedProjects={projects || this.props.api.InternationalProjects}
                      chartData={csvCharts}
                      lang={lang} /></li>
                  <li><Print lang={lang} /></li>
                </ul>
              </div>
                <h1 className='inpage__title heading--deco heading--large'>{t.International_projects_title}</h1>
                <p className='inpage__description'>{t.International_projects_description}</p>
            </div>
            <div className='inpage__actions'>
            <div className='actions-filters'>
                <ul className='button--list'>
                  <li onClick={this.openProjectSelector}><button type='button' className='button button--medium button--primary'>{t.filter_projects_btn}</button></li>

                </ul>
                {activeProjectFilters.length ? (
                  <div className='filters'>
                    <label className='heading--label'>Filters</label>
                    {activeProjectFilters.map((filter) => (
                      <button
                        onClick={() => this.removeActiveFilter(filter)}
                        key={filter.display}
                        className='button button--small button--tag'>{filter.display}</button>
                    ))}
                    <button
                      onClick={this.clearProjectFilters}
                      className='button button--xsmall button--tag-unbounded'>Clear Filters</button>
                  </div>
                ) : null}
              </div>
              <div className='actions-toggle'>
                <div className='button-group button-group--horizontal button--toggle'>
                  <button onClick={this.selectMapView} className={this.state.listView ? deselectedClassNames : selectedClassNames}>{t.map_toggle_btn}</button>
                  <button onClick={this.selectListView} className={this.state.listView ? selectedClassNames : deselectedClassNames}>{t.list_toggle_btn}</button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={`map__actions ${this.state.listView ? 'hidden' : ''}`}>
          <div className='inner'>
            <div className='map__search-input'>
              <div className='autosuggest'>
                  <AutoSuggest
                  suggestions={governorates}
                  getDisplayName={(d) => d.name}
                  placeholder={t.search_text}
                  onSelect={this.zoomToGovernorate}
                  />
              </div>
              <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--search-icon"><span>Button</span></button></span>
            </div>
          </div>
        </div>

        {this.state.listView
          ? (<div>
            {indicatorChartData && (
              <div className='inpage__body'>
                <div className='inner indicator-list'>
                  <section className='inpage__section'>
                    <div className='section__header'>
                      <h1 className='section__title'>Indicators</h1>
                      <div className='indicator-list-container'>
                        <HorizontalBarChart
                          data={indicatorChartData}
                          margin={barChartMargin}
                          yTitle=''
                          lang={lang}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
            <ProjectList projects={projects} meta={this.props.meta} lang={this.props.meta.lang} title={t.International_projects_title}/>
            </div>)
          : (<div className='map__outer'>
              <Map location={mapLocation} markers={markers} overlay={overlay} lang={this.props.meta.lang} projects={projects}/>

            </div>)}
        {this.state.modal && this.state.activeModal === PROJECTS && this.renderProjectSelector()}
        <ReactTooltip html={true} delayHide={500} effect='solid'/>
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

module.exports = connect(mapStateToProps)(InternationalProjectBrowse);
