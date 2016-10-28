'use strict';
import React from 'react';

var Elements = React.createClass({
  displayName: 'Elements',

  render: function () {
    return (
      <div className='row row--centered'>
        <h1 className='heading--xlarge heading--deco'>This is a headline deco</h1>
        <h2 className='heading--large heading--deco'>This is a headline deco</h2>
        <h3 className='heading--medium heading--deco'>This is a headline deco</h3>
        <h4 className='heading--small'>This is a headline</h4>

        <hr />

        <p><a href='#' className='link--primary'>Primary link</a></p>
        <p><a href='#' className='link--secondary'>secondary link</a></p>
        <p><a href='#' className='link--deco'>Deco link</a></p>
        <p><a href='#' className='link--deco link--deco-active'>Deco link active</a></p>

        <hr />

        <p><button className='button button--base'>Base</button></p>
        <p><button className='button button--primary'>Primary</button></p>

        <p><button className='button button--primary drop__toggle--caret'>Primary</button></p>

        <p><button className='button button--base-bounded'>Base bounded</button></p>
        <p><button className='button button--primary-bounded'>Primary bounded</button></p>

        <hr />

        <div className='button-group button-group--horizontal'>
          <button className='button button--primary'>Primary</button>
          <button className='button button--primary-bounded'>Primary bounded</button>
        </div>

        <hr />

        <div className='filters'>
          <label className='heading--label'>Sort By:</label>
          <button className='button button--medium button--secondary drop__toggle--caret'>Category</button>
        </div>

        <hr />

        <div style={{ width: '20rem' }}>
          <article className='card project--ontime'>
            <div className='card__contents'>
              <header className='card__header'>
                <p className='card__subtitle'><a className='link--secondary' href=''>Category</a></p>
                <h1 className='card__title'><a className='link--deco' href=''>Project Name</a></h1>

                <ul className='card-cmplt'>
                  <li><span>60% cmplt</span></li>
                </ul>
              </header>
              <div className='card__body'>
                <dl className='card-meta'>
                  <dt className='card-meta__label'>Status</dt>
                  <dd className='card-meta__value card-meta__value--status'>On time</dd>
                  <dt className='card-meta__label'>Location</dt>
                  <dd className='card-meta__value card-meta__value--location'>Location 1, Location 2</dd>
                </dl>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.</p>

                <ul className='card-stats'>
                  <li>$50M <small>funding</small></li>
                  <li>20,000 <small>households</small></li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        <hr />

        <fieldset className="form__fieldset">
          <div className="form__group">
           <label className="form__label">Checkbox options (custom)</label>
           <label className="form__option form__option--custom-checkbox">
             <input type="checkbox" name="form-checkbox" id="form-checkbox-1" value="Checkbox 1" />
             <span className="form__option__text">Checkbox 1</span>
             <span className="form__option__ui"></span>
           </label>
           <label className="form__option form__option--custom-checkbox">
             <input type="checkbox" name="form-checkbox" value="form-checkbox-2" />
             <span className="form__option__text">Checkbox 2</span>
             <span className="form__option__ui"></span>
           </label>
           <label className="form__option form__option--custom-checkbox">
             <input type="checkbox" name="form-checkbox" value="form-checkbox-3" />
             <span className="form__option__text">Checkbox 3</span>
             <span className="form__option__ui"></span>
           </label>
          </div>
        </fieldset>

        <fieldset className="form__fieldset">
          <legend className="form__legend">Inputs</legend>
             <div className="form__group">
               <label className="form__label" for="form-input-5">Input group</label>
               <div className="form__input-group">
                 <input type="text" className="form__control form__control--medium" id="form-input-5" placeholder="This is a placeholder"/>
                 <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--search-icon"><span>Button</span></button></span>
               </div>
             </div>
             <div className="form__group">
               <label className="form__label" for="form-input-6">Input group</label>
               <div className="form__input-group">
                 <input type="text" className="form__control form__control--medium" id="form-input-6" placeholder="Search location"/>
                 <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--newsletter-icon"><span>Button</span></button></span>
               </div>
             </div>
           </fieldset>

        <div className='filters'>
          <label className='heading--label'>Filters</label>
          <button className='button button--small button--filter-tag'>Category</button>
          <button className='button button--small button--filter-tag'>Project Type</button>
          <button className='button button--xsmall button--filter-clear'>Clear Filters</button>
        </div>

      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default Elements;
