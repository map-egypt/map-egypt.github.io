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
        {this.state.isOpen && <div className='share--box'>
          <p>Copy this: {url.resolve(baseUrl, this.props.path)}</p>
          <p onClick={this.close}>Close this</p>
        </div>}
      </span>
    );
  }
});

module.exports = ShareButton;
