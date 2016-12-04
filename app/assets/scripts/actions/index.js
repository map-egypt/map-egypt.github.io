import reqwest from 'reqwest';
import storage from 'store';
import * as topojson from 'topojson-client';
import url from 'url';
import { api, baseUrl } from '../config';
import auth from '../utils/auth';

export const ACTION = 'ACTION';
export const AUTHENTICATED = 'AUTHENTICATED';
export const PROJECTS = 'PROJECTS';
export const PROJECT = 'PROJECT';
export const INDICATORS = 'INDICATORS';
export const INDICATOR = 'INDICATOR';
export const GEOGRAPHY = 'GEOGRAPHY';
export const LANGUAGE = 'LANGUAGE';

export function hideModalAbout () {
  return { type: ACTION };
}

export function updateAuth (data) {
  return { type: AUTHENTICATED, data: data };
}

export function updateProjects (data) {
  return { type: PROJECTS, data: data };
}

export function updateProject (data) {
  return { type: PROJECT, data: data };
}

export function updateIndicators (data) {
  return { type: INDICATORS, data: data };
}

export function updateIndicator (data) {
  return { type: INDICATOR, data: data };
}

export function updateGeography (data) {
  return { type: GEOGRAPHY, data: data };
}

export function updateLang (lang) {
  return { type: LANGUAGE, data: lang };
}

export function getAuthStatus (cb) {
  return function (dispatch) {
    auth.registerDispatch(function (isAuthenticated) {
      dispatch(updateAuth(isAuthenticated));
      if (cb && typeof cb === 'function') {
        cb();
      }
    });
  };
}

export function getProjects () {
  return function (dispatch) {
    queryApi('projects', function (data) {
      return dispatch(updateProjects(data));
    });
  };
}

export function getProject (id) {
  if (!id) {
    throw new Error('Project endpoint requires project id');
  }
  return function (dispatch) {
    queryApi('projects/' + id, function (data) {
      return dispatch(updateProject(data));
    });
  };
}

export function getIndicators () {
  return function (dispatch) {
    queryApi('indicators', function (data) {
      return dispatch(updateIndicators(data));
    });
  };
}

export function getIndicator (id) {
  if (!id) {
    throw new Error('Indicator endpoint requires indicator id');
  }
  return function (dispatch) {
    queryApi('indicators/' + id, function (data) {
      return dispatch(updateIndicator(data));
    });
  };
}

export function getGeography (name) {
  return function (dispatch) {
    // a2-withluxor.json = governorate boundaries post 2009.
    // if we need pre-2009 governorate boundaries, we can generate them in /tool.
    reqwest(url.resolve(baseUrl, 'assets/data/topojson/a2-withluxor.json'), function (resp) {
      try {
        var features = topojson.feature(resp, resp.objects[name]);
      } catch (e) {
        console.log('Topojson.feature() failed');
        return;
      }
      return dispatch(updateGeography({ features, name }));
    });
  };
}

// helper to wrap setting the token header if there is one
function queryApi (asset, callback) {
  const options = {
    url: url.resolve(api, asset),
    method: 'GET',
    type: 'json',
    contentType: 'application/json',
    success: callback,
    error: (error) => { throw new Error(error); }
  };
  const token = storage.get('id_token');
  if (token) {
    options.headers = {
      'Authorization': token
    };
  }
  return reqwest(options);
}
