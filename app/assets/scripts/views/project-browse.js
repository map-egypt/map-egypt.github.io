'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { without, clone } from 'lodash';
import ReactTooltip from 'react-tooltip';

import { getIndicator } from '../actions';
import Map from '../components/map';
import Print from '../components/print-btn';
import CSVBtn from '../components/csv-btn';
import Share from '../components/share';
import ProjectList from '../components/project-list';
import AutoSuggest from '../components/auto-suggest';
import { isOntime } from '../components/project-card';
import { governorates } from '../utils/governorates';
import { GOVERNORATE, DISTRICT, getProjectCentroids } from '../utils/map-utils';
import slugify from '../utils/slugify';
import { indicatorTooltipContent } from '../utils/tooltips';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import { window } from 'global';

const PROJECTS = 'projects';
const INDICATORS = 'indicators';
const indicatorTypes = ['SDS Indicators', 'SDG Indicators', 'Other Development Indicators'];
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

// Project filters
const STATUS = {
  display: 'Project Status',
  items: [
    { display: 'On Time', filter: isOntime },
    { display: 'Delayed', filter: (p) => !isOntime(p) }
  ]
};

const CATEGORY = {
  display: 'Category',
  items: (projects, lang) => {
    const categories = countByProp(projects.reduce((a, b) => a.concat(b.categories), []), lang);
    return Object.keys(categories).map((category) => ({
      display: `${category} (${categories[category]})`,
      filter: (p) => Array.isArray(p.categories) && p.categories.map(d => d[lang]).indexOf(category) >= 0
    }));
  }
};

const DONOR = {
  display: 'Donor',
  items: (projects) => {
    const donors = countByProp(projects.reduce((a, b) => a.concat(b.budget), []), 'donor_name');
    return Object.keys(donors).map((donor) => ({
      display: `${donor} (${donors[donor]})`,
      filter: (p) => Array.isArray(p.budget) && p.budget.find((budget) => budget.donor_name === donor)
    }));
  }
};

const SDS = {
  display: 'SDS Goals',
  items: (projects, lang) => {
    const goals = countByProp(projects.reduce((a, b) => a.concat(b.sds_indicators), []), lang);
    return Object.keys(goals).sort().map((goal) => ({
      display: `${goal} (${goals[goal]})`,
      filter: (p) => Array.isArray(p.sds_indicators) && p.sds_indicators.map(d => d[lang]).indexOf(goal) >= 0
    }));
  }
};

const SDG = {
  display: 'SDG Goals',
  items: (projects, lang) => {
    const goals = countByProp(projects.reduce((a, b) => a.concat(b.sdg_indicators), []), lang);
    return Object.keys(goals).map((goal) => goal).sort().map((goal) => ({
      display: `${goal} (${goals[goal]})`,
      filter: (p) => Array.isArray(p.sdg_indicators) && p.sdg_indicators.map(d => d[lang]).indexOf(goal) >= 0
    }));
  }
};

const projectFilters = [STATUS, CATEGORY, DONOR, SDS, SDG];
const digit = new RegExp(/[0-9]+/);

var ProjectBrowse = React.createClass({
  displayName: 'ProjectBrowse',

  getInitialState: function () {
    return {

      // modal open or closed
      modal: false,

      // which modal (projects or indicators)
      activeModal: null,

      // is the indicator dropdown open
      indicatorToggle: false,

      // is the view set to list view or map
      listView: false,

      // what's the currently active indicator
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      selectedIndicators: [],
      activeIndicators: [],
      activeIndicator: null,

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

  componentWillMount: function () {
    const activeIndicatorType = get(this.props, 'route.modal');
    if (activeIndicatorType) {
      this.setState({
        modal: true,
        activeModal: INDICATORS,
        activeIndicatorType
      });
    }
  },

  componentDidUpdate: function () {
    ReactTooltip.rebuild();
  },

  componentWillUpdate: function (nextProps, nextState) {
    const activeIndicator = nextState.activeIndicator;
    if (activeIndicator && activeIndicator !== this.state.activeIndicator) {
      const meta = this.props.api.indicators.find((indicator) => indicator.name === activeIndicator);
      if (meta && meta.id) {
        this.props.dispatch(getIndicator(meta.id));
      }
    }
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

  // indicator modals
  openIndicatorDropdown: function () {
    this.setState({indicatorToggle: true});
  },

  closeIndicatorDropdown: function (e) {
    setTimeout(() => {
      this.setState({indicatorToggle: false});
    }, 200);
  },

  openIndicatorSelector: function (activeIndicatorType) {
    activeIndicatorType = activeIndicatorType.split(' ')[0].toUpperCase();
    this.setState({
      modal: true,
      activeModal: INDICATORS,
      indicatorToggle: false,
      activeIndicatorType,
      selectedIndicators: this.state.activeIndicators.length ? clone(this.state.activeIndicators) : []
    });
  },

  cancelIndicators: function () {
    this.setState({
      modal: false,
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      selectedIndicators: this.state.activeIndicators.length ? clone(this.state.activeIndicators) : []
    });
  },

  confirmIndicators: function () {
    const active = this.state.selectedIndicators.length ? clone(this.state.selectedIndicators) : [];
    this.setState({
      modal: false,
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      activeIndicators: active,
      activeIndicator: active.length ? active[0] : null
    });
  },

  selectIndicatorSubType: function (type) {
    this.setState({
      activeIndicatorTheme: type
    });
  },

  setActiveIndicator: function (activeIndicator) {
    this.setState({ activeIndicator });
  },

  removeActiveIndicator: function (indicator) {
    const { activeIndicator, activeIndicators } = this.state;
    const nextActiveIndicators = without(activeIndicators, indicator);
    // if the one we're removing is currently active, make the next one active
    const nextActiveIndicator = activeIndicator !== indicator ? activeIndicator
      : nextActiveIndicators.length ? nextActiveIndicators[0] : null;
    this.setState({
      activeIndicators: nextActiveIndicators,
      activeIndicator: nextActiveIndicator
    });
  },

  // project modal
  openProjectSelector: function () {
    this.setState({
      modal: true,
      indicatorToggle: false,
      activeModal: PROJECTS,
      selectedProjectFilters: this.state.activeProjectFilters.length ? clone(this.state.activeProjectFilters) : []
    });
  },

  toggleSelectedIndicator: function (indicator) {
    let active = this.state.selectedIndicators;
    if (active.indexOf(indicator) >= -0) {
      active = without(active, indicator);
    } else {
      active = active.concat([indicator]);
    }
    this.setState({
      selectedIndicators: active
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

  renderIndicatorSelector: function () {
    const { selectedIndicators, activeIndicatorTheme, activeIndicatorType } = this.state;
    const { lang } = this.props.meta;
    const indicatorProp = activeIndicatorType.toLowerCase();
    const indicators = get(this.props.api, 'indicators', []).filter((indicator) => {
      return indicator.theme.length && indicator.theme.find(d => d.type === indicatorProp);
    });

    const themes = {};
    indicators.forEach((indicator) => {
      indicator.theme.forEach((theme) => {
        if (theme.type === indicatorProp) {
          let themeName = theme[lang];
          themes[themeName] = themes[themeName] || [];
          themes[themeName].push(indicator);
        }
      });
    });

    const themeNames = Object.keys(themes).sort((a, b) => {
      let digitA = a.match(digit);
      if (digitA) {
        let digitB = b.match(digit);
        if (digitB) {
          return Number(digitA[0]) > Number(digitB[0]) ? 1 : -1;
        }
      } else {
        return a > b ? -1 : 1;
      }
    });

    const indicatorTheme = activeIndicatorTheme || themeNames[0];
    const availableIndicators = get(themes, indicatorTheme, []);
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__indicators'>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
          <h1 className='inpage__title heading--deco heading--medium'>Add {this.state.activeIndicatorType.toUpperCase()} Indicators</h1>
          <div className='modal__instructions'><p>Add and compare development indicators listed below.</p></div>

          <div className='indicators--selected'>
            <span className='heading--label'>Selected Indicators:&nbsp;</span>
            {selectedIndicators.map((name) => {
              return (
                <span className='button--small button--tag'
                  key={name}
                  onClick={() => this.toggleSelectedIndicator(name)}>{name}</span>
              );
            })}
          </div>

          <div className='indicators__container'>
            <div className='indicators'>
              <ul>
                {themeNames.length && themeNames.map((name) => {
                  return (
                    <li key={name}
                    className={'list__item' + (name === indicatorTheme ? ' list__item--active' : '')}
                    onClick={() => this.selectIndicatorSubType(name)}>{name}</li>
                  );
                })}
              </ul>
            </div>
            <div className='indicators--options'>
              {availableIndicators.length && availableIndicators.map((indicator) => {
                const name = indicator.name;
                const id = 'subtypes-' + slugify(name);

                return (
                  <label key={name}
                    className={'form__option form__option--custom-checkbox' + (selectedIndicators.indexOf(name) >= 0 ? ' form__option--custom--checkbox--selected' : '')}>
                    <input type='checkbox' name='form-checkbox'
                      checked={selectedIndicators.indexOf(name) >= 0}
                      id={id}
                      value={name}
                      onChange={() => this.toggleSelectedIndicator(name)} />
                    <span className='form__option__text'>{name}</span>
                    <span className='form__option__ui'></span>
                    <span className='form__option__info' data-tip={indicatorTooltipContent(indicator)}>?</span>
                  </label>
                );
              })}
            </div>
          </div>
            <ul className='button--list'>
              <li><button
                  onClick={this.confirmIndicators}
                  type='button' className='button button--medium button--primary'>Apply</button></li>
              <li><button
                  onClick={this.cancelIndicators}
                  type='button' className='button button--medium button--primary-bounded'>Cancel</button></li>
            </ul>
        </div>
      </section>
    );
  },

  renderActiveIndicators: function (activeIndicator, activeIndicators) {
    return (
      <div className='indicator__overlay'>
        <h1 className='heading--label'>Selected Indicator Overlays</h1>
        <ul className='indicator__overlay--list'>
          {activeIndicators.map((indicator) => (
            <li
              key={indicator}
              onClick={() => true}
              className={'indicator__overlay--item' + (activeIndicator === indicator ? ' indicator__overlay--selected' : '')}>
              <button className='indicator-toggle' onClick={() => this.setActiveIndicator(indicator)}><span>toggle visibility</span></button>
              <span className='indicator-layer-name'>{indicator}</span>
              <span className='form__option__info' data-tip={indicatorTooltipContent(this.props.api.indicators.find(i => i.name === indicator))}>?</span>
              <button className='indicator-close' onClick={() => this.removeActiveIndicator(indicator)}><span>close indicator</span></button>
            </li>
          ))}
        </ul>
      </div>
    );
  },

  renderProjectSelector: function () {
    let projects = this.props.api.projects;
    let { lang } = this.props.meta;
    const { selectedProjectFilters } = this.state;

    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__projects'>
          <h1 className='inpage__title heading--deco heading--medium'>Add and Filter Projects</h1>
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
                <span className='form__option__text'>All Projects</span>
                <span className='form__option__ui'></span>
              </label>
              <a onClick={this.resetProjectFilters} className='link--secondary'>reset filters</a>
            </div>

            {projectFilters.map((filter) => (

              <fieldset key={filter.display}
                className='form__fieldset'>

                 <label className='form__label'>{filter.display}</label>
                 <div className='form__group'>
                  {(Array.isArray(filter.items) ? filter.items : filter.items(projects, lang)).map((item) => (
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
                  className='button button--medium button--primary'>Apply</button></li>
              <li><button
                  onClick={this.cancelFilters}
                  type='button'
                  className='button button--medium button--primary-bounded'>Cancel</button></li>
            </ul>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
        </div>
      </section>
    );
  },

  render: function () {
    const selectedClassNames = 'button button--primary';
    const deselectedClassNames = 'button button--primary-bounded';

    let mapLocation;
    const governorateId = get(this.state, 'activeGovernorate.egy');
    if (governorateId) {
      const features = get(this.props.api, 'geography.' + GOVERNORATE + '.features', []);
      mapLocation = features.find((feature) => get(feature, 'properties.admin_id') === governorateId);
    }

    const { activeProjectFilters, activeIndicators, activeIndicator } = this.state;

    let projects = [];
    let markers = [];
    if (!this.state.projectsHidden) {
      projects = this.props.api.projects;
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
    if (activeIndicator) {
      const indicatorMeta = this.props.api.indicators.find((indicator) => indicator.name === activeIndicator);
      const indicatorData = get(this.props.api, 'indicatorDetail.' + indicatorMeta.id);
      if (indicatorData) {
        overlay = this.createOverlay(indicatorData);
      }
      if (indicatorData && Array.isArray(indicatorData.data.data)) {
        indicatorChartData = indicatorData.data.data.map(d => ({
          name: d.sub_nat_id,
          value: isNaN(d.data_value) ? d.data_value : +d.data_value
        }));
        csvCharts = [{
          title: activeIndicator,
          data: indicatorChartData
        }];
      }
    }

    const { lang } = this.props.meta;
    const t = get(window.t, [lang, 'projects_indicators'], {});

    return (
      <section className='inpage project-browse'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
             <div className='inpage__headline-actions'>
                <ul>
                  <li><CSVBtn
                      title={'All Projects'}
                      relatedProjects={projects || this.props.api.projects}
                      chartData={csvCharts}
                      lang={lang} /></li>
                  <li><Print lang={lang} /></li>
                  <li><Share path={this.props.location.pathname} lang={lang}/></li>
                </ul>
              </div>
                <h1 className='inpage__title heading--deco heading--large'>{t.projects_title}</h1>
                <p className='inpage__description'>{t.projects_description}</p>
            </div>
            <div className='inpage__actions'>
            <div className='actions-filters'>
                <ul className='button--list'>
                  <li onClick={this.openProjectSelector}><button type='button' className='button button--medium button--primary'>{t.filter_projects_btn}</button></li>
                  <li>
                    <span className='dropdown__container' onBlur={this.closeIndicatorDropdown}>
                      <button type='button' onClick={this.openIndicatorDropdown}
                        className='button button--medium button--secondary drop__toggle--caret'>{t.indicator_overlays_btn}</button>
                      {this.state.indicatorToggle &&
                        <ul className='drop__menu drop--align-left button--secondary'>
                          {indicatorTypes.map((d) => {
                            return <li key={d}
                              onClick={() => this.openIndicatorSelector(d)}
                              className='drop__menu-item'>{d}</li>;
                          })}
                        </ul>
                      }
                    </span>
                  </li>
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
                      {activeIndicators.length && this.renderActiveIndicators(activeIndicator, activeIndicators)}
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
            <ProjectList projects={projects} meta={this.props.meta} lang={this.props.meta.lang}/>
            </div>)
          : (<div className='map__outer'>
              <Map location={mapLocation} markers={markers} overlay={overlay} lang={this.props.meta.lang}/>
              {activeIndicators.length ? this.renderActiveIndicators(activeIndicator, activeIndicators) : null}
            </div>)}
        {this.state.modal && this.state.activeModal === PROJECTS && this.renderProjectSelector()}
        {this.state.modal && this.state.activeModal === INDICATORS && this.renderIndicatorSelector()}
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

module.exports = connect(mapStateToProps)(ProjectBrowse);
