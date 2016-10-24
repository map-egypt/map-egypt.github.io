'use strict';
import React from 'react';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  propTypes: {
  },

  render: function () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <div className='updates'>
            <div className='form__group'>
              <h1 className='updates__title heading--small'> Want Updates? </h1>
              <p className='updates__description'>Get notifications when we update projects quarterly.</p>
              <div className="form__input-group">
                 <input type="text" className="form__control form__control--medium" id="form-input-6" placeholder="Search location"/>
                 <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--newsletter-icon"><span>Button</span></button></span>
               </div>
            </div>
          </div>
          <div className='logos'>
            <ul className='logos__list'>
              <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href=''><img src='assets/graphics/content/iflri.png' alt='View sponsor website'/></a></li>
              <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href=''><img src='assets/graphics/content/malr.png' alt='View sponsor website'/></a></li>
              <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href=''><img width='150px' src='assets/graphics/content/usaid.jpg' alt='View sponsor website'/></a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
