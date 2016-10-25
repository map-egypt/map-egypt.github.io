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
             <h1 className='page__title'><a href='/' title='Visit homepage'>
              <img src='/assets/graphics/layout/logo.svg' alt='logotype' height='65' />
            </a></h1>  
          </div>
          <nav className='page__prime-nav'>
            <div className='nav-block' id='nav-block-browse'>
              <ul className='browse-menu'>
                <li><Link to='/projects' title='Visit projects and indicators page' className='browse-menu__item link--deco' activeClassName='link--deco-active'><span>Projects & Indicators</span></Link></li>
                <li><Link to='/about' title='Visit about page' className='browse-menu__item link--deco' activeClassName='browse-menu__item link--deco'><span>About</span></Link></li>
                <li><Link to='/contact' title='Visit contact page' className='browse-menu__item link--deco' activeClassName='browse-menu__item link--deco'><span>Contact</span></Link></li>
              </ul>
              <ul className='utilities-menu'>
                <li><Link to='/en' title='Visit projects and indicators page' className='browse-menu__item link--deco' activeClassName='link--deco-active'><span>English</span></Link></li>
                <li><Link to='/ar' title='Visit about page' className='browse-menu__item link--deco' activeClassName='browse-menu__item'><span>Arabic</span></Link></li>
                <li><Link to='/about' title='Visit about page' className='browse-menu__item link--deco' activeClassName='browse-menu__item'><span>Log In</span></Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
