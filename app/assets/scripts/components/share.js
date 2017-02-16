'use strict';
import React from 'react';
import url from 'url';
import hideOnBlur from 'react-click-outside';
import { get } from 'object-path';
import { baseUrl } from '../config';
import Clipboard from 'clipboard';
import { window } from 'global';

const ShareButton = React.createClass({
  displayName: 'ShareButton',

  propTypes: {
    path: React.PropTypes.string,
    meta: React.PropTypes.object,
    lang: React.PropTypes.string
  },

  getInitialState: function () {
    return { isOpen: false };
  },

  show: function () {
    this.setState({ isOpen: true });
  },

  close: function () {
    this.setState({ isOpen: false });
  },

  handleClickOutside () {
    setTimeout(() => {
      this.close();
    }, 100);
  },

  componentDidMount: function () {
    this.clipboard = new Clipboard('#share-url-button');
  },

  componentWillUnmount: function () {
    if (this.clipboard && typeof this.clipboard.destroy === 'function') {
      this.clipboard.destroy();
    }
  },

  render: function () {
    const openClass = this.state.isOpen ? ' drop__content--open' : '';
    const { lang } = this.props;
    const t = get(window.t, [lang, 'general_buttons'], {});
    return (
      <span className='share--container'>
        <button className='button button--medium button--primary' onClick={this.show}>{t.share}</button>
        {this.state.isOpen && <div className={'share--box drop__content drop--align-right' + openClass}>
        <div className='form__group'>
          <label className='form__label'>{t.share_text}</label>
          <div className='form__input-group'>
            <input id='share-url-field' readOnly type='text' className='form__control form__control--medium' value={url.resolve(baseUrl, '#' + this.props.path)}/>
            <span className='form__input-group-button'><button type='submit' className='button button--primary button--text-hidden button--medium button--copy-icon' data-clipboard-target='#share-url-field' id='share-url-button'><span>Button</span></button></span>
          </div>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.close}></button>
        </div>}
      </span>
    );
  }
});

module.exports = hideOnBlur(ShareButton);
