import reqwest from 'reqwest';
import storage from 'store';
import * as topojson from 'topojson-client';
import url from 'url';
import { api, baseUrl } from '../config';
import auth from '../utils/auth';

const BASE_URL = baseUrl || 'http://localhost:3000';

export const ACTION = 'ACTION';
export const AUTHENTICATED = 'AUTHENTICATED';
export const PROJECTS = 'PROJECTS';
export const INDICATORS = 'INDICATORS';
export const GEOGRAPHY = 'GEOGRAPHY';

export function hideModalAbout () {
  return { type: ACTION };
}

export function updateAuth (data) {
  return { type: AUTHENTICATED, data: data };
}

export function updateProjects (data) {
  return { type: PROJECTS, data: data };
}

export function updateIndicators (data) {
  return { type: INDICATORS, data: data };
}

export function updateGeography (data) {
  return { type: GEOGRAPHY, data: data };
}

export function getAuthStatus () {
  return function (dispatch) {
    auth.registerDispatch(function (isAuthenticated) {
      dispatch(updateAuth(isAuthenticated));
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

export function getIndicators () {
  return function (dispatch) {
    queryApi('indicators', function (data) {
      return dispatch(updateIndicators(data));
    });
  };
}

export function getGeography () {
  return function (dispatch) {
    reqwest(url.resolve(BASE_URL, 'assets/data/topojson/a2-withluxor.json'), function (resp) {
      try {
        var features = topojson.feature(resp, resp.objects['egy2']);
      } catch (e) {
        console.log('Topojson.feature() failed');
        return;
      }
      return updateGeography(features);
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
