'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { without, clone } from 'lodash';

import Map from '../components/map';
import ProjectList from '../components/project-list';
import AutoSuggest from '../components/auto-suggest';
import { governorates } from '../utils/governorates';
import { GOVERNORATE, getProjectCentroids } from '../utils/map-utils';
import slugify from '../utils/slugify';

const PROJECTS = 'projects';
const INDICATORS = 'indicators';
const indicatorTypes = ['SDS Indicators', 'SDG Indicators', 'Other Development Indicators'];

var ProjectBrowse = React.createClass({
  displayName: 'ProjectBrowse',

  getInitialState: function () {
    return {
      modal: false,
      activeModal: null,
      indicatorToggle: false,
      listView: false,
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      selectedIndicators: [],
      activeIndicators: [],
      activeGovernorate: null
    };
  },

  propTypes: {
    api: React.PropTypes.object,
    meta: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  zoomToGovernorate: function (event, value) {
    const selected = value.suggestion;
    this.setState({
      activeGovernorate: selected
    });
  },

  toggleIndicatorDropdown: function () {
    this.setState({indicatorToggle: !this.state.indicatorToggle});
  },

  openIndicatorSelector: function (activeIndicatorType) {
    activeIndicatorType = activeIndicatorType.split(' ')[0].toUpperCase();
    this.setState({
      modal: true,
      activeModal: INDICATORS,
      indicatorToggle: false,
      activeIndicatorType
    });
  },

  cancelIndicators: function () {
    this.setState({
      modal: false,
      activeModal: null,
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      selectedIndicators: this.state.activeIndicators.length ? clone(this.state.activeIndicators) : []
    });
  },

  confirmIndicators: function () {
    this.setState({
      modal: false,
      activeModal: null,
      activeIndicatorType: null,
      activeIndicatorTheme: null,
      activeIndicators: this.state.selectedIndicators.length ? clone(this.state.selectedIndicators) : []
    });
  },

  selectIndicatorSubType: function (type) {
    this.setState({
      activeIndicatorTheme: type
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

  openProjectSelector: function () { this.setState({ modal: true, activeModal: PROJECTS }); },
  closeModal: function () { this.setState({ modal: false, activeModal: null }); },

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
    const availableIndicators = get(themes, activeIndicatorTheme, []);
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__indicators'>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
          <h1 className='inpage__title heading--deco heading--medium'>Add {this.state.activeIndicatorType.toUpperCase()} Indicators</h1>
          <p>Add and compare development indicators listed below.</p>

          {selectedIndicators.length ? (
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
          ) : null}
          <div className='indicators__container'>
            <div className='indicators'>
              <ul>
                {themeNames.length && themeNames.map((name) => {
                  return (
                    <li key={name}
                    className={'list__item' + (name === activeIndicatorTheme ? ' list__item--active' : '')}
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
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__projects'>
          <h1 className='inpage__title heading--deco heading--medium'>Add and Filter Projects</h1>
          <div className='modal__filters'>
            <div className='modal__filters--defaults'>
              <label className='form__option form__option--custom-checkbox'>
                <input type='checkbox' name='form-checkbox' id='form-checkbox-1' value='Checkbox 1' />
                <span className='form__option__text'>Add All Projects</span>
                <span className='form__option__ui'></span>
              </label>
              <a className='link--secondary'>reset filters</a>
            </div>
            <fieldset className='form__fieldset'>
              <div className='form__group'>
                <label className='form__label'>Project Status</label>
                <label className='form__option form__option--custom-checkbox'>
                  <input type='checkbox' name='form-checkbox' id='form-checkbox-1' value='Checkbox 1' />
                  <span className='form__option__text'>On Time</span>
                  <span className='form__option__ui'></span>
                </label>
                <label className='form__option form__option--custom-checkbox'>
                  <input type='checkbox' name='form-checkbox' value='form-checkbox-2' />
                  <span className='form__option__text'>Delayed</span>
                  <span className='form__option__ui'></span>
                </label>
              </div>
            </fieldset>
            <fieldset className='form__fieldset'>
              <div className='form__group'>
                <label className='form__label'>Category</label>
                <label className='form__option form__option--custom-checkbox'>
                  <input type='checkbox' name='form-checkbox' id='form-checkbox-1' value='Checkbox 1' />
                  <span className='form__option__text'>Category 1</span>
                  <span className='form__option__ui'></span>
                </label>
                <label className='form__option form__option--custom-checkbox'>
                  <input type='checkbox' name='form-checkbox' value='form-checkbox-2' />
                  <span className='form__option__text'>Category 2</span>
                  <span className='form__option__ui'></span>
                </label>
              </div>
            </fieldset>
            <ul className='button--list'>
              <li><button type='button' className='button button--medium button--primary'>Apply</button></li>
              <li><button type='button' className='button button--medium button--primary-bounded'>Cancel</button></li>
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
    const projects = this.props.api.projects;

    let mapLocation;
    const governorateId = get(this.state, 'activeGovernorate.egy');
    if (governorateId) {
      const features = get(this.props.api, 'geography.' + GOVERNORATE + '.features', []);
      mapLocation = features.find((feature) => get(feature, 'properties.admin_id') === governorateId);
    }

    const markers = getProjectCentroids(projects, get(this.props.api, 'geography.' + GOVERNORATE + '.features'));

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
             <div className='inpage__headline-actions'>
                <ul>
                  <li><button type='button' className='button button--medium button--primary'>Share</button></li>
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
                        <ul className='drop__menu drop__content button--secondary'>
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
                <div className='filters'>
                  <label className='heading--label'>Filters</label>
                  <button className='button button--small button--tag'>Category</button>
                  <button className='button button--small button--tag'>Project Type</button>
                  <button className='button button--xsmall button--tag-unbounded'>Clear Filters</button>
                </div>
              </div>
              <div className='actions-toggle'>
                <div className='button-group button-group--horizontal button--toggle'>
                  <button onClick={this.selectMapView} className={this.state.listView ? deselectedClassNames : selectedClassNames}>Map</button>
                  <button onClick={this.selectListView} className={this.state.listView ? selectedClassNames : deselectedClassNames}>List</button>
                </div>
              </div>
            </div>
            <div className='autosuggest'>
              <AutoSuggest
                suggestions={governorates}
                getDisplayName={(d) => d.name}
                placeholder='Zoom to Governorate'
                onSelect={this.zoomToGovernorate}
              />
            </div>
          </div>
        </header>

        {this.state.listView
          ? <ProjectList projects={projects} meta={this.props.meta} />
          : <Map location={mapLocation} markers={markers}/>}

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
