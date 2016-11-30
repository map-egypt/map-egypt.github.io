'use strict';
import React from 'react';
import url from 'url';
import { baseUrl } from '../config';

const ShareButton = React.createClass({
  displayName: 'ShareButton',

  propTypes: {
    path: React.PropTypes.string
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

  render: function () {
    return (
      <span className='share--container'>
        <button className='button button--medium button--primary' onClick={this.show}>Share</button>
        {this.state.isOpen && <div className='share--box drop__content drop--align-right'>
        <div className='form__group'>
          <label className="form__label">Copy URL to Share</label>
          <div className="form__input-group">
            <input readonly type="text" className="form__control form__control--medium" readOnly value={url.resolve(baseUrl, this.props.path)}/>
            <span className="form__input-group-button"><button type="submit" className="button button--primary button--text-hidden button--medium button--copy-icon"><span>Button</span></button></span>
          </div>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.close}></button>
        </div>}
      </span>
    );
  }
});

module.exports = ShareButton;
