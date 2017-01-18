'use strict';
import React from 'react';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  getInitialState: function () {
    return {'email': ''};
  },

  propTypes: {
  },

  onChange: function (e) {
    this.setState({
      email: e.target.value
    });
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
                <div id="mc_embed_signup">
                  <form action="//github.us14.list-manage.com/subscribe/post?u=7a02eb473bd111aa85bfb7ffc&amp;id=120d44b3d2" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate form__input-group" target="_blank" noValidate>
                    <input type="email" value={this.state.email} placeholder="Enter email address" name="EMAIL" className="required email form__control form__control--large" id="form-input-6" onChange={this.onChange}/>
                    <div id="mce-responses" className="clear">
                      <div className="response" id="mce-error-response" style={{'display': 'none'}}></div>
                      <div className="response" id="mce-success-response" style={{'display': 'none'}}></div>
                    </div>
                    <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--large button--newsletter-icon"><span>Button</span></button></span>
                  </form>
                </div>

              </div>
            </div>
            <div className='logos'>
              <ul className='logos__list'>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.agr-egypt.gov.eg/'><img src='assets/graphics/content/malr.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.ifpri.org/'><img src='assets/graphics/content/iflri.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='https://www.usaid.gov/'><img width='150px' src='assets/graphics/content/usaid.png' alt='View sponsor website'/></a></li>
              </ul>
            </div>
          </div>
          <div className='contact'>
            <p className='contact__item'><a title='contact us' href='mailto:H.Eldidi@cgiar.org' className='link--primary'><span>Contact Us</span></a> with questions or comments.</p>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
