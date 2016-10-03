'use strict';
import React from 'react';
import { Link } from 'react-router';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
  },

  render: function () {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            { /* <h1 className='page__title'><a href='/' title='Visit homepage'>
              <img src='/assets/graphics/layout/logo.svg' alt='logotype' height='48' />
              <span>Project Name</span>
            </a></h1> */ }
            <h1 className='page__title'><a href='/' title='Visit homepage'>Project Name</a></h1>
          </div>
          <nav className='page__prime-nav'>
            <h2 className='page__prime-nav-title'><a href='#nav-block-browse'> <span>Menu</span></a></h2>
            <div className='nav-block' id='nav-block-browse'>
              <ul className='browse-menu'>
                <li><Link to='/projects' title='Visit projects and indicators page' className='browse-menu__item' activeClassName='browse-menu__item--active'><span>Projects & Indicators</span></Link></li>
                <li><Link to='/about' title='Visit about page' className='browse-menu__item' activeClassName='browse-menu__item--active'><span>About</span></Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
