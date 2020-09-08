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
import Clusters from 'leaflet.markercluster'; // eslint-disable-line no-unused-vars

import window from 'global/window';
window.L.mapbox.accessToken = 'pk.eyJ1IjoibWFwLWVneXB0IiwiYSI6ImNpdmxkMjl6bTA3c2YyeXBvNDJnZDlqZGMifQ.KQSizb18ILr6wri0cBcd2Q';

import config from './config';
import reducer from './reducers';
import { GOVERNORATE, DISTRICT } from './utils/map-utils';

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

import { getAuthStatus, getProjects, getInternationalProjects, getNationalProjects, getIndicators, getGeography, updateLang } from './actions';
import { hasValidToken, resumeAuth } from './utils/auth';
const needsValidatedFetch = !hasValidToken();
store.dispatch(getAuthStatus(function () {
  if (needsValidatedFetch) {
    store.dispatch(getProjects());
    store.dispatch(getInternationalProjects());
    store.dispatch(getNationalProjects());
  }
}));
store.dispatch(getProjects());
store.dispatch(getInternationalProjects());
store.dispatch(getNationalProjects());
store.dispatch(getIndicators());
store.dispatch(getGeography(GOVERNORATE)); // fetch governorates
store.dispatch(getGeography(DISTRICT)); // fetch districts

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

// Components
import App from './views/app';
import Home from './views/home';
import UhOh from './views/uhoh';
import InternationalProjectBrowse from './views/internationalProject-browse';
import NationalProjectBrowse from './views/nationalProject-browse';
import IndicatorBrowse from './views/indicator-browse';
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
      <Route path='/404' component={UhOh} />
      <Route path='/access_token=:access_token' onEnter={completeAuth} />
      <Route path='/:lang' component={App} onEnter={redirectToLastUrl}>
        <Route path='international_projects' component={InternationalProjectBrowse} />
        <Route path='national_projects' component={NationalProjectBrowse} />
        <Route path='indicators' component={IndicatorBrowse}/>
        <Route path='projects_sds' component={InternationalProjectBrowse} modal='SDS' />
        <Route path='projects_sdg' component={InternationalProjectBrowse} modal='SDG' />
        <Route path='projects_other' component={InternationalProjectBrowse} modal='other' />
        <Route path='projects/:id' component={Project} />
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

function completeAuth (nextState, replace) {
  resumeAuth(`access_token=${nextState.params.access_token}`);
  redirectToLastUrl(nextState, replace);
}

function redirectToLastUrl (nextState, replace) {
  const path = storage.get('last_path_before_auth');
  if (path) {
    storage.clear('last_path_before_auth');
    replace({pathname: path});
  }
  detectLanguageChange(nextState.location);
}

function detectLanguageChange (location) {
  const current = store.getState().meta.lang;
  const next = location.pathname.split('/').filter(Boolean)[0];
  if (!current || current !== next) {
    store.dispatch(updateLang(next));
  }
}
