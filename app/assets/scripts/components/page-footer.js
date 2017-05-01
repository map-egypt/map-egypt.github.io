'use strict';
import React from 'react';
import { get } from 'object-path';
import { window } from 'global';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  getInitialState: function () {
    return {'email': ''};
  },

  propTypes: {
    lang: React.PropTypes.string
  },

  onChange: function (e) {
    this.setState({
      email: e.target.value
    });
  },

  render: function () {
    const t = get(window.t, [this.props.lang, 'footer'], {});
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <div>
            <div className='updates'>
              <div className='form__group'>
                <h1 className='updates__title heading--xsmall'>{t.subscription_title}</h1>
                <p className='updates__description'>{t.subscription_subtitle} <span className='italic'>{t.subscription_subtitle_timeframe}</span>.</p>
                <div id='mc_embed_signup'>
                  <form action='//github.us15.list-manage.com/subscribe?u=894bba1697000794bd3b3af0b&id=302df7ea11' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' className='validate form__input-group' target='_blank' noValidate>
                    <input type='email' value={this.state.email} placeholder={t.email_field} name='EMAIL' className='required email form__control form__control--large' id='form-input-6' onChange={this.onChange}/>
                    <div id='mce-responses' className='clear'>
                      <div className='response' id='mce-error-response' style={{'display': 'none'}}></div>
                      <div className='response' id='mce-success-response' style={{'display': 'none'}}></div>
                    </div>
                    <span className='form__input-group-button'><button type='submit' className='button button--primary button--text-hidden button--large button--newsletter-icon'><span>Button</span></button></span>
                  </form>
                </div>

              </div>
            </div>
            <div className='logos'>
              <ul className='logos__list'>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.ifpri.org/'><img src='assets/graphics/content/iflri.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='https://www.giz.de/en/worldwide/369.html'><img src='assets/graphics/content/giz-red-logo.jpg' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://scalingupnutrition.org/sun-countries/yemen/'><img src='assets/graphics/content/logo-scalingup.jpg' alt='View sponsor website'/></a></li>
              </ul>
            </div>
          </div>
          <div className='contact'>
            <p className='contact__item'><a title='contact us' href='mailto:fpri-egypt@cgiar.org' className='link--primary'><span>{t.contact_link}</span></a> {t.contact_sentence}.</p>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
