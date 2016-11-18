import reqwest from 'reqwest';
import url from 'url';
import { api } from '../config';
import auth from '../utils/auth';
import storage from 'store';

export const ACTION = 'ACTION';
export const AUTHENTICATED = 'AUTHENTICATED';
export const PROJECTS = 'PROJECTS';
export const INDICATORS = 'INDICATORS';

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
