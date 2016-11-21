'use strict';
import {
  AUTHENTICATED,
  PROJECTS,
  INDICATORS,
  GEOGRAPHY
} from '../actions';

export const initialState = {
  authenticated: false,
  projects: [],
  indicators: [],
  geography: null
};

export default function reducer (state = initialState, action) {
  if (action.type === AUTHENTICATED) {
    return Object.assign({}, state, { authenticated: action.data });
  } else if (action.type === PROJECTS) {
    return Object.assign({}, state, { projects: action.data });
  } else if (action.type === INDICATORS) {
    return Object.assign({}, state, { indicators: action.data });
  } else if (action.type === GEOGRAPHY) {
    return Object.assign({}, state, { geogrpahy: action.data });
  } else {
    return state;
  }
}
