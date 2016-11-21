'use strict';
import React from 'react';
import { Link } from 'react-router';
import auth from '../utils/auth';
import storage from 'store';
import { updateAuth } from '../actions';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    authenticated: React.PropTypes.bool,
    lang: React.PropTypes.string
  },

  onRootMenuClick: function (e) {
    document.documentElement.classList.remove('offcanvas-revealed');
  },

  offcanvasMenuClick: function (e) {
    e.preventDefault();
    document.documentElement.classList.toggle('offcanvas-revealed');
  },

  onLoginClick: function () {
    storage.set('last_path_before_auth', this.props.location.pathname);
    auth.login();
  },

  onLogoutClick: function () {
    auth.logout();
    this.props.dispatch(updateAuth(false));
  },

  // componentDidMount: function () {
    // document.addEventListener('click', this.documentListener);
  // },

  // componentWillUnmount: function () {
  //   document.removeEventListener('click', this.documentListener);
  // },

  render: function () {
    const basepath = '/' + this.props.lang;
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
             <h1 className='page__title'><a href='/' title='Visit homepage'>
              <img src='/assets/graphics/layout/logo.svg' alt='logotype' height='65' />
            </a></h1>
          </div>
          <nav className='page__prime-nav'>
            <h2 className='page__prime-nav-title'><a href='#nav-block-browse' onClick={this.offcanvasMenuClick}><span>Menu</span></a></h2>
            <div className='nav-block' id='nav-block-browse'>
              <ul className='browse-menu'>
                <li><Link to={basepath + '/projects'} title='Visit projects and indicators page' className='browse-menu__item link--deco' activeClassName='link--deco-active' onClick={this.onRootMenuClick}><span>Projects & Indicators</span></Link></li>
                <li><Link to={basepath + '/about'} title='Visit about page' className='browse-menu__item link--deco' activeClassName='browse-menu__item link--deco' onClick={this.onRootMenuClick}><span>About</span></Link></li>
                <li><Link to={basepath + '/contact'} title='Visit contact page' className='browse-menu__item link--deco' activeClassName='browse-menu__item link--deco' onClick={this.onRootMenuClick}><span>Contact</span></Link></li>
              </ul>
              <ul className='utilities-menu'>
                <li><Link to='/en' title='Switch to English' className='browse-menu__item link--deco' activeClassName='link--deco-active' onClick={this.onRootMenuClick}><span>English</span></Link></li>
                <li><Link to='/ar' title='Switch to Arabic' className='browse-menu__item link--deco' activeClassName='link--deco-active' onClick={this.onRootMenuClick}><span>Arabic</span></Link></li>
                {!this.props.authenticated && <li><Link title='Log in' className='browse-menu__item link--deco' activeClassName='browse-menu__item' onClick={this.onLoginClick}><span>Log In</span></Link></li>}
                {this.props.authenticated && <li><Link to='/' title='Log out' className='browse-menu__item link--deco' activeClassName='browse-menu__item' onClick={this.onLogoutClick}><span>Log Out</span></Link></li>}

              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
