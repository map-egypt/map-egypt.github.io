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
          <p className='copyright'>Made with {'<3'} by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a></p>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
