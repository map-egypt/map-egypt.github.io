'use strict';
import React from 'react';
import { get } from 'object-path';
import { window } from 'global';

var Print = React.createClass({
  displayName: 'Print',

  propTypes: {
    lang: React.PropTypes.string
  },

  print: function () {
    if (typeof window.print === 'function') {
      window.print();
    }
  },

  render: function () {
    const t = get(window.t, [this.props.lang, 'category_pages'], {});
    return (
      <button className='button button--medium button--primary button--download' onClick={this.print}>{t.print_pdf}</button>
    );
  }
});

module.exports = Print;
