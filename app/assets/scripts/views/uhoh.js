'use strict';
import React from 'react';

var UhOh = React.createClass({
  displayName: 'UhOh',

  render: function () {
    return (
    <div className='error'>
      <div className='error-content'>
        <h1 className='heading--xxlarge heading--deco'>Page Not Found</h1>
        <p>We were not able to find the page you're looking for.</p>
        <button className='button button--primary button--large'>Take Me Home</button>
      </div>
    </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default UhOh;
