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
          <div className='contact'>
            <p className='contact__item'><a title='contact us' href='mailto:ifpri-egypt@cgiar.org' className='link--primary'><span>{t.contact_link}</span></a> {t.contact_sentence}.</p>
          </div>
          <div>
            <div className='logos'>
              <ul className='logos__list'>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://egyptssp.ifpri.info/'><img src='assets/graphics/content/iflri.png' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='http://www.agr-egypt.gov.eg/'><img src='assets/graphics/content/malr.jpg' alt='View sponsor website'/></a></li>
                <li><a title='Visit sponsor webpage' className='logos__item' target='_blank' href='https://www.usaid.gov/'><img width='150px' src='assets/graphics/content/usaid.png' alt='View sponsor website'/></a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
