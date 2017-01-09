'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { without, clone } from 'lodash';

import { getIndicator } from '../actions';
import Map from '../components/map';
import Share from '../components/share';
import ProjectList from '../components/project-list';
import AutoSuggest from '../components/auto-suggest';
import { isOntime } from '../components/project-card';
import { governorates } from '../utils/governorates';
import { GOVERNORATE, getProjectCentroids } from '../utils/map-utils';
import slugify from '../utils/slugify';

const PROJECTS = 'projects';
const INDICATORS = 'indicators';
const indicatorTypes = ['SDS Indicators', 'SDG Indicators', 'Other Development Indicators'];

function countByProp (array, property) {
  const result = {};
  array.forEach((item) => {
    const name = property ? item[property] : item;
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
  items: (projects) => {
    const categories = countByProp(projects.reduce((a, b) => a.concat(b.categories), []));
    return Object.keys(categories).map((category) => ({
      display: `${category} (${categories[category]})`,
      filter: (p) => Array.isArray(p.categories) && p.categories.indexOf(category) >= 0
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
  items: (projects) => {
    const goals = countByProp(projects.reduce((a, b) => a.concat(b.sds_indicators), []));
    return Object.keys(goals).map((goal) => ({
      display: `${goal} (${goals[goal]})`,
      filter: (p) => Array.isArray(p.sds_indicators) && p.sds_indicators.indexOf(goal) >= 0
    }));
  }
};

const projectFilters = [STATUS, CATEGORY, DONOR, SDS];

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
      activeProjectFilters: []
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
  toggleIndicatorDropdown: function () {
    this.setState({indicatorToggle: !this.state.indicatorToggle});
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

  closeModal: function () {
    this.setState({ modal: false, activeModal: null });
  },

  selectListView: function () { this.setState({ listView: true }); },
  selectMapView: function () { this.setState({ listView: false }); },

  renderIndicatorSelector: function () {
    const { selectedIndicators, activeIndicatorTheme, activeIndicatorType } = this.state;
    const indicatorProp = activeIndicatorType.toLowerCase();
    const indicators = get(this.props.api, 'indicators', []).filter((indicator) => {
      return indicator.type && indicator.type[indicatorProp];
    });

    const themes = {};
    indicators.forEach((indicator) => {
      themes[indicator.theme] = themes[indicator.theme] || [];
      themes[indicator.theme].push(indicator);
    });
    const themeNames = Object.keys(themes);
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
                let name = indicator.name;
                let id = 'subtypes-' + slugify(name);
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

  renderProjectSelector: function () {
    let projects = this.props.api.projects;
    const { selectedProjectFilters } = this.state;
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__projects'>
          <h1 className='inpage__title heading--deco heading--medium'>Add and Filter Projects</h1>
          <div className='modal__filters'>
            <div className='modal__filters--defaults'>
              <label className='form__option form__option--custom-checkbox'>
                <input
                  checked={!selectedProjectFilters.length}
                  type='checkbox'
                  name='form-checkbox'
                  id='form-checkbox-1'
                  onChange={this.clearProjectFilters}
                  value='All projects' />
                <span className='form__option__text'>All Projects</span>
                <span className='form__option__ui'></span>
              </label>
              <a onClick={this.resetProjectFilters} className='link--secondary'>reset filters</a>
            </div>

            {projectFilters.map((filter) => (

              <fieldset key={filter.display}
                className='form__fieldset'>
                <div className='form__group'>
                  <label className='form__label'>{filter.display}</label>
                  {(Array.isArray(filter.items) ? filter.items : filter.items(projects)).map((item) => (
                    <label key={item.display}
                      className='form__option form__option--custom-checkbox'>
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

    let { projects } = this.props.api;
    if (activeProjectFilters.length) {
      activeProjectFilters.forEach((filter) => {
        projects = projects.filter(filter.filter);
      });
    }
    const markers = getProjectCentroids(projects, get(this.props.api, 'geography.' + GOVERNORATE + '.features'));

    let overlay;
    if (activeIndicator) {
      const indicatorMeta = this.props.api.indicators.find((indicator) => indicator.name === activeIndicator);
      const indicatorData = get(this.props.api, 'indicatorDetail.' + indicatorMeta.id);
      const regions = get(this.props.api, 'geography.' + GOVERNORATE);
      if (indicatorData) {
        overlay = {
          id: indicatorData.id,
          values: indicatorData.data.data.map((d) => ({
            id: d.sub_nat_id,
            value: d.data_value
          })),
          regions
        };
      }
    }

    return (
      <section className='inpage project-browse'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
             <div className='inpage__headline-actions'>
                <ul>
                  <li><Share path={this.props.location.pathname}/></li>
                </ul>
              </div>
                <h1 className='inpage__title heading--deco heading--large'>Projects and Indicators</h1>
                <p className='inpage__description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
            </div>
            <div className='inpage__actions'>
            <div className='actions-filters'>
                <ul className='button--list'>
                  <li onClick={this.openProjectSelector}><button type='button' className='button button--medium button--primary'>Add &amp; Filter Projects</button></li>
                  <li>
                    <span className='dropdown__container'>
                      <button type='button' onClick={this.toggleIndicatorDropdown}
                        className='button button--medium button--secondary drop__toggle--caret'>Add Indicator Overlays</button>
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
                  <button onClick={this.selectMapView} className={this.state.listView ? deselectedClassNames : selectedClassNames}>Map</button>
                  <button onClick={this.selectListView} className={this.state.listView ? selectedClassNames : deselectedClassNames}>List</button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className='map__actions'>
          <div className='inner'>
            <div className='map__search-input'>
              <div className='autosuggest'>
                  <AutoSuggest
                  suggestions={governorates}
                  getDisplayName={(d) => d.name}
                  placeholder='Zoom to Governorate'
                  onSelect={this.zoomToGovernorate}
                  />
              </div>
              <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--search-icon"><span>Button</span></button></span>
            </div>
          </div>
        </div>

        {this.state.listView
          ? <ProjectList projects={projects} meta={this.props.meta} />
          : (<div className='map__outer'>
              <Map location={mapLocation} markers={markers} overlay={overlay} lang={this.props.meta.lang}/>
              {activeIndicators.length ? (<div className='indicator__overlay'>
                <h1 className='heading--label'>Selected Indicator Overlays</h1>
                <ul className='indicator__overlay--list'>
                  {activeIndicators.map((indicator) => (
                    <li
                      key={indicator}
                      onClick={() => true}
                      className={'indicator__overlay--item' + (activeIndicator === indicator ? ' indicator__overlay--selected' : '')}>
                      <button className='indicator-toggle' onClick={() => this.setActiveIndicator(indicator)}><span>toggle visibility</span></button>
                      <span className='indicator-layer-name'>{indicator}</span>
                      <button className='indicator-close' onClick={() => this.removeActiveIndicator(indicator)}><span>close indicator</span></button>
                    </li>
                  ))}
                </ul>
              </div>) : null}
            </div>)}

        {this.state.modal && this.state.activeModal === PROJECTS && this.renderProjectSelector()}
        {this.state.modal && this.state.activeModal === INDICATORS && this.renderIndicatorSelector()}

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
