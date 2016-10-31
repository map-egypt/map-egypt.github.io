'use strict';
import React from 'react';

var ProjectBrowse = React.createClass({
  displayName: 'ProjectBrowse',

  render: function () {
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
                <p className='inpage__description--header'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam. Lorem ipsum dolor sit amet, consectetur elit. </p>
            </div>
            <div className='inpage__project-actions'>
              <ul className='button--list map-actions'>
                <li><button type='button' className='button button--medium button--primary drop__toggle--caret'>Add Indicator Overlays</button></li>
                <li><button type='button' className='button button--medium button--primary'>Add & Filter Projects</button></li>
              </ul>
              <div className='map-toggle-container'>
                <div className='button-group button-group--horizontal map-toggle'>
                  <button className='button button--primary'>Map</button>
                  <button className='button button--primary-bounded'>List</button>
                </div>
              </div>
            </div>
            <div className='map-filter-tags'>
              <div className='tags'>
                <label className='heading--label'>Filters</label>
                <button className='button button--small button--filter-tag'>Category</button>
                <button className='button button--small button--filter-tag'>Project Type</button>
                <button className='button button--xsmall button--filter-clear'>Clear Filters</button>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section'>
              <h2 className='inpage__section--title'>Selected SDG Indicators</h2>
            </section>
            <section className='inpage__section'>
              <div className='inpage__section-navigation'>
                <h2 className='inpage__section--title-aligned'>Projects</h2>
                <div className='filters'>
                  <label className='heading--label'>Sort By:</label>
                  <button className='button button--medium button--secondary drop__toggle--caret'>Category</button>
                </div>
              </div>
            </section>
          </div>
        </div>

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
                 <label className="form__option form__option--custom-checkbox">
                   <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                   <span className="form__option__text">Category 3</span>
                   <span className="form__option__ui"></span>
                 </label>
                 <label className="form__option form__option--custom-checkbox">
                   <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                   <span className="form__option__text">Category 4</span>
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
                 <label className="form__option form__option--custom-checkbox">
                   <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                   <span className="form__option__text">Category 3</span>
                   <span className="form__option__ui"></span>
                 </label>
                 <label className="form__option form__option--custom-checkbox">
                   <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
                   <span className="form__option__text">Category 4</span>
                   <span className="form__option__ui"></span>
                 </label>
                </div>
              </fieldset>

              <ul className='button--list'>
                <li><button type='button' className='button button--medium button--primary'>Apply</button></li>
                <li><button type='button' className='button button--medium button--primary-bounded'>Cancel</button></li>
              </ul>

            </div>
            <button className='modal__button-dismiss' title='close'></button>
          </div>
        </section>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default ProjectBrowse;
