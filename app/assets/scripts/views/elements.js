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

        <p><a href='#' className=''>Normal link</a></p>
        <p><a href='#' className='link--deco'>Deco link</a></p>
        <p><a href='#' className='link--deco link--deco-active'>Deco link active</a></p>

        <hr />

        <p><button className='button button--base'>Base</button></p>
        <p><button className='button button--primary'>Primary</button></p>

        <p><button className='button button--base-bounded'>Base bounded</button></p>
        <p><button className='button button--primary-bounded'>Primary bounded</button></p>

        <hr />

        <div className='button-group button-group--horizontal'>
          <button className='button button--primary-bounded button--active'>Primary</button>
          <button className='button button--primary-bounded'>Primary bounded</button>
        </div>

        <hr />

        <div style={{ width: '20rem' }}>
          <article className='card project--ontime'>
            <div className='card__contents'>
              <header className='card__header'>
                <p className='card__subtitle'>Category</p>
                <h1 className='card__title'>Project Name</h1>

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

      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default Elements;
