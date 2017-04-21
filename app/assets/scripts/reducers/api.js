'use strict';
import { set } from 'object-path';
import {
  AUTHENTICATED,
  PROJECTS,
  PROJECT,
  INDICATORS,
  GEOGRAPHY
} from '../actions';

export const initialState = {
  authenticated: false,
  projects: [],
  projectDetail: {},
  indicators: [],
  geography: null
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case AUTHENTICATED:
      set(state, 'authenticated', action.data);
      break;
    case PROJECTS:
      set(state, 'projects', action.data);
      break;
    case PROJECT:
      set(state, ['projectDetail', action.data.id], action.data);
      break;
    case INDICATORS:
      set(state, 'indicators', action.data);
      break;
    case GEOGRAPHY:
      set(state, 'geography', action.data);
      break;
  }
  return state;
}
