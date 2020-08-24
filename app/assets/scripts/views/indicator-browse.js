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
import AutoSuggest from '../components/auto-suggest';
import { governorates } from '../utils/governorates';
import { GOVERNORATE, DISTRICT } from '../utils/map-utils';
import { indicatorTooltipContent } from '../utils/tooltips';
import HorizontalBarChart from '../components/charts/horizontal-bar';
import { window } from 'global';

const PROJECTS = 'projects';
const INDICATORS = 'indicators';
const indicatorTypes = ['sds', 'sdg', 'other'];
const barChartMargin = { left: 75, right: 20, top: 10, bottom: 50 };

// Sort function for indicators names.
// First checks if there is a digit, ie. `Pillar 1`.
// Otherwise sorts alphabetically.
const digit = new RegExp(/[0-9]+/);
const digitSort = (a, b) => {
  let digitA = a.match(digit);
  if (digitA) {
    let digitB = b.match(digit);
    if (digitB) {
      return Number(digitA[0]) > Number(digitB[0]) ? 1 : -1;
    }
  } else {
    return a < b ? -1 : 1;
  }
};

var IndicatorBrowse = React.createClass({
  displayName: 'IndicatorBrowse',

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
      const meta = this.props.api.indicators.find((indicator) => indicator.name === activeIndicator || indicator.name_ar === activeIndicator);
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
    activeIndicatorType = activeIndicatorType.split(' ')[0];
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
      activeIndicator: active.length ? active[0].name : null
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
    const nextActiveIndicator = activeIndicator !== indicator.name ? activeIndicator
      : nextActiveIndicators.length ? nextActiveIndicators[0].name : null;
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
      activeModal: PROJECTS

    });
  },

  toggleSelectedIndicator: function (id) {
    let active = this.state.selectedIndicators;
    // get indicator by id
    const indicator = get(this.props.api, 'indicators').find(ind => ind.id === id);
    if (active.findIndex(indicate => indicate.id === id) >= 0) {
      active = without(active, indicator);
    } else {
      active = active.concat([indicator]);
    }
    this.setState({
      selectedIndicators: active
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
    const t = get(window.t, [lang, 'projects_indicators'], {});

    const themes = {};
    indicators.forEach((indicator) => {
      indicator.theme.forEach((theme) => {
        if (theme.type === indicatorProp) {
          let themeName = theme[lang];
          if (!themeName) return;
          themes[themeName] = themes[themeName] || [];
          themes[themeName].push(indicator);
        }
      });
    });

    const themeNames = Object.keys(themes).sort(digitSort);
    const indicatorTheme = activeIndicatorTheme && themeNames.indexOf(activeIndicatorTheme) >= 0 ? activeIndicatorTheme : themeNames[0];
    const indicatorNameProp = lang === 'en' ? 'name' : 'name_ar';
    const availableIndicators = get(themes, indicatorTheme, []).sort((a, b) => {
      return a[indicatorNameProp] < b[indicatorNameProp] ? -1 : 1;
    });
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__indicators'>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
          <h1 className='inpage__title heading--deco heading--medium'>{t.add} {t[this.state.activeIndicatorType.toLowerCase() + '_dropdown']}</h1>
          <div className='modal__instructions'><p>{t.compare_indicators}</p></div>

          <div className='indicators--selected'>
            <span className='heading--label'>{t.selected_indicators}</span>
            {selectedIndicators.map((indicate) => {
              return (
                <span className='button--small button--tag'
                  key={indicate.name}
                  onClick={() => this.toggleSelectedIndicator(indicate.id)}>{indicate[indicatorNameProp]}</span>
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
                const name = indicator[indicatorNameProp];
                if (!name) return null;
                const id = indicator.id;

                return (
                  <label key={id}
                    className={'form__option form__option--custom-checkbox' + (selectedIndicators.findIndex(indicate => indicate.id === id) >= 0 ? ' form__option--custom--checkbox--selected' : '')}>
                    <input type='checkbox' name='form-checkbox'
                      checked={selectedIndicators.findIndex(indicate => indicate.id === id) >= 0}
                      id={id}
                      value={name}
                      onChange={() => this.toggleSelectedIndicator(indicator.id)} />
                    <span className='form__option__text'>{name}</span>
                    <span className='form__option__ui'></span>
                    <span className='form__option__info' data-tip={indicatorTooltipContent(indicator, lang)}>?</span>
                  </label>
                );
              })}
            </div>
          </div>
            <ul className='button--list'>
              <li><button
                  onClick={this.confirmIndicators}
                  type='button' className='button button--medium button--primary'>{t.apply}</button></li>
              <li><button
                  onClick={this.cancelIndicators}
                  type='button' className='button button--medium button--primary-bounded'>{t.cancel}</button></li>
            </ul>
        </div>
      </section>
    );
  },

  renderActiveIndicators: function (activeIndicator, activeIndicators) {
    const { lang } = this.props.meta;
    const indicatorNameProp = lang === 'en' ? 'name' : 'name_ar';
    const t = get(window.t, [lang, 'projects_indicators'], {});
    return (
      <div className='indicator__overlay'>
        <h1 className='heading--label'>{t.selected_overlays}</h1>
        <ul className='indicator__overlay--list'>

          {activeIndicators.map((indicator) => (

            <li
              key={indicator.id}
              onClick={() => true}
              className={'indicator__overlay--item' + (activeIndicator === indicator.name ? ' indicator__overlay--selected' : '')}>
              <button className='indicator-toggle' onClick={() => this.setActiveIndicator(indicator.name)}><span>toggle visibility</span></button>
              <span className='indicator-layer-name'>{indicator[indicatorNameProp]}</span>
              <span className='form__option__info' data-tip={indicatorTooltipContent(this.props.api.indicators.find(i => i.name === indicator.name || i.name_ar === indicator.name), lang)}>?</span>
              <button className='indicator-close' onClick={() => this.removeActiveIndicator(indicator)}><span>close indicator</span></button>
            </li>
          ))}
        </ul>
      </div>
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

    const { activeIndicators, activeIndicator } = this.state;

    let projects = [];

    let overlay;
    let indicatorChartData;
    let csvCharts;
    if (activeIndicator) {
      const indicatorMeta = this.props.api.indicators.find((indicator) => indicator.name === activeIndicator || indicator.name_ar === activeIndicator);
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
                </ul>
              </div>
                <h1 className='inpage__title heading--deco heading--large'>{t.Indicators_title}</h1>
                <p className='inpage__description'>{t.Indicators_description}</p>
            </div>
            <div className='inpage__actions'>
            <div className='actions-filters'>
                <ul className='button--list'>
                  <li>
                    <span className='dropdown__container' onBlur={this.closeIndicatorDropdown}>
                      <button type='button' onClick={this.openIndicatorDropdown}
                        className='button button--medium button--secondary drop__toggle--caret'>{t.indicator_overlays_btn}</button>
                      {this.state.indicatorToggle &&
                        <ul className='drop__menu drop--align-left button--secondary'>
                          {indicatorTypes.map((d) => {
                            let display = t[d + '_dropdown'];
                            return <li key={d}
                              onClick={() => this.openIndicatorSelector(d)}
                              className='drop__menu-item'>{display}</li>;
                          })}
                        </ul>
                      }
                    </span>
                  </li>
                </ul>

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
            </div>)
          : (<div className='map__outer'>
              <Map location={mapLocation} overlay={overlay} lang={this.props.meta.lang}/>
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

module.exports = connect(mapStateToProps)(IndicatorBrowse);
