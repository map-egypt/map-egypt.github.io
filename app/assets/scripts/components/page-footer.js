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
          <div>
            <div className='updates'>
              <div className='form__group'>
                <h1 className='updates__title heading--xsmall'> Want Updates? </h1>
                <p className='updates__description'>Get notifications when we update projects <span className='italic'>quarterly</span>.</p>
                <div className="form__input-group">
                   <input type="text" className="form__control form__control--large" id="form-input-6" placeholder="Enter email address"/>
                   <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--large button--newsletter-icon"><span>Button</span></button></span>
                 </div>
              </div>
            </div>
            <div className='logos'>
              <ul className='logos__list'>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.agr-egypt.gov.eg/'><img src='assets/graphics/content/malr.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='https://www.usaid.gov/'><img width='150px' src='assets/graphics/content/usaid.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.ifpri.org/'><img src='assets/graphics/content/iflri.png' alt='View sponsor website'/></a></li>
              </ul>
            </div>
          </div>
          <div className='contact'>
            <p className='contact__item'><a title='Contact Us' href=''>Contact Us</a></p>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
