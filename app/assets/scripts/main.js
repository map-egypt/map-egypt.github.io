'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';

import config from './config';
import reducer from './reducers';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

const store = createStore(reducer, applyMiddleware(logger));

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

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/uhoh' component={UhOh} />
      <Route path='/:lang' component={App}>
        <Route path='projects' component={ProjectBrowse} />
        <Route path='projects/:name' component={Project} />
        <Route path='category/:name' component={Category} />
        <Route path='donor/:name' component={Donor} />
        <Route path='owner/:name' component={Owner} />
        <Route path='ministry/:name' component={Ministry} />
        <Route path='about' component={About} />
        <Route path='contact' component={Contact} />
        <IndexRoute component={Home} pageClass='page--homepage' />
      </Route>
      <Redirect from='/' to='/en' />
    </Router>
  </Provider>
), document.querySelector('#app-container'));
