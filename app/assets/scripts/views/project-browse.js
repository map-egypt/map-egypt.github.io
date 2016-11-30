'use strict';
import React from 'react';
import { connect } from 'react-redux';

import Map from '../components/map';
import ProjectList from '../components/project-list';

const PROJECTS = 'projects';
const INDICATORS = 'indicators';

var ProjectBrowse = React.createClass({
  displayName: 'ProjectBrowse',

  getInitialState: function () {
    return {
      modal: false,
      activeModal: null,
      indicatorToggle: false,
      indicator: null,
      listView: false
    };
  },

  propTypes: {
    api: React.PropTypes.object,
    meta: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  toggleIndicatorDropdown: function () { this.setState({indicatorToggle: !this.state.indicatorToggle}); },
  openIndicatorSelector: function (indicator) {
    this.setState({
      modal: true,
      activeModal: INDICATORS,
      indicatorToggle: false,
      indicator
    });
  },
  openProjectSelector: function () { this.setState({ modal: true, activeModal: PROJECTS }); },
  closeModal: function () { this.setState({ modal: false, activeModal: null }); },

  selectListView: function () { this.setState({ listView: true }); },
  selectMapView: function () { this.setState({ listView: false }); },

  renderIndicatorSelector: function () {
    return (
      <section className='modal modal--large'>
        <div className='modal__inner modal__projects'>
          <button className='modal__button-dismiss' title='close' onClick={this.closeModal}></button>
          <h1 className='inpage__title heading--deco heading--medium'>Add {this.state.indicator.toUpperCase()} Indicators</h1>
          <p>Add and compare development indicators listed below.</p>
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
              <label className="form__option form__option--custom-checkbox">
                <input type="checkbox" name="form-checkbox" id="form-checkbox-1" value="Checkbox 1" />
                <span className="form__option__text">Add All Projects</span>
                <span className="form__option__ui"></span>
              </label>
              <a className='link--secondary'>reset filters</a>
            </div>
            <fieldset className="form__fieldset">
              <div className="form__group">
                <label className="form__label">Project Status</label>
                <label className="form__option form__option--custom-checkbox">
                  <input type="checkbox" name="form-checkbox" id="form-checkbox-1" value="Checkbox 1" />
                  <span className="form__option__text">On Time</span>
                  <span className="form__option__ui"></span>
                </label>
                <label className="form__option form__option--custom-checkbox">
                  <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                  <span className="form__option__text">Delayed</span>
                  <span className="form__option__ui"></span>
                </label>
              </div>
            </fieldset>
            <fieldset className="form__fieldset">
              <div className="form__group">
                <label className="form__label">Category</label>
                <label className="form__option form__option--custom-checkbox">
                  <input type="checkbox" name="form-checkbox" id="form-checkbox-1" value="Checkbox 1" />
                  <span className="form__option__text">Category 1</span>
                  <span className="form__option__ui"></span>
                </label>
                <label className="form__option form__option--custom-checkbox">
                  <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                  <span className="form__option__text">Category 2</span>
                  <span className="form__option__ui"></span>
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
                        <ul className='dropdown__list button--secondary'>
                          {['SDS Indicators', 'SDG Indicators', 'Other Development Indicators'].map((d) => {
                            const key = d.toLowerCase().split(' ')[0];
                            return <li key={key}
                              onClick={() => this.openIndicatorSelector(key)}
                              className='dropdown__item' data-value={key}>{d}</li>;
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
          </div>
        </header>

        {this.state.listView
          ? <ProjectList projects={this.props.api.projects} meta={this.props.meta} />
          : <Map />}

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
