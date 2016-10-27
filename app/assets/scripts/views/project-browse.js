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
                <li><button type='button' className='button button--medium button--primary'>Add Indicator Overlays</button></li>
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
              <h2 className='inpage__section--title'>Projects</h2>
            </section>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default ProjectBrowse;
