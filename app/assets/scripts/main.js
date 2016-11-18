'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { useScroll } from 'react-router-scroll';
import { Router, Route, IndexRoute, Redirect, hashHistory, applyRouterMiddleware } from 'react-router';
import storage from 'store';

// Set up mapbox (which attaches to global `L`)
import Mapbox from 'mapbox.js'; // eslint-disable-line no-unused-vars
import config from './config';
import reducer from './reducers';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

const store = createStore(reducer, applyMiddleware(
  thunkMiddleware,
  logger
));

import { getAuthStatus, getProjects, getIndicators, getGeography } from './actions';
store.dispatch(getAuthStatus());
store.dispatch(getProjects());
store.dispatch(getIndicators());
store.dispatch(getGeography());

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

// Components
import App from './views/app';
import Home from './views/home';
import UhOh from './views/uhoh';
import ProjectBrowse from './views/project-browse';
import Project from './views/project';
import Category from './views/category';
import Donor from './views/donor';
import Owner from './views/owner';
import Ministry from './views/ministry';
import About from './views/about';
import Contact from './views/contact';

import Elements from './views/elements';

render((
  <Provider store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(scrollerMiddleware)}>
      <Route path='/uhoh' component={UhOh} />
      <Route path='/access_token=:token' />
      <Route path='/:lang' component={App} onEnter={redirectToLastUrl}>
        <Route path='projects' component={ProjectBrowse} />
        <Route path='projects/:name' component={Project} />
        <Route path='category/:name' component={Category} />
        <Route path='donor/:name' component={Donor} />
        <Route path='owner/:name' component={Owner} />
        <Route path='ministry/:name' component={Ministry} />
        <Route path='about' component={About} />
        <Route path='contact' component={Contact} />

        <Route path='elements' component={Elements} />

        <IndexRoute component={Home} pageClass='page--homepage' />
      </Route>
      <Redirect from='/' to='/en' />
    </Router>
  </Provider>
), document.querySelector('#app-container'));

function redirectToLastUrl (nextState, replace) {
  const path = storage.get('last_path_before_auth');
  if (path) {
    storage.clear('last_path_before_auth');
    replace({pathname: path});
  }
}
