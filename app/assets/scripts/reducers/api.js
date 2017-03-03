'use strict';
import { get, set } from 'object-path';
import {
  AUTHENTICATED,
  PROJECTS,
  PROJECT,
  INDICATORS,
  INDICATOR,
  GEOGRAPHY
} from '../actions';

export const initialState = {
  authenticated: false,
  projects: [],
  projectDetail: {},
  indicators: [],
  geography: {}
};

import { DISTRICT } from '../utils/map-utils';

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
    case INDICATOR:
      set(state, ['indicatorDetail', action.data.id], action.data);
      break;
    case GEOGRAPHY:
      // normalize district admin properties
      if (action.data.name === DISTRICT) {
        get(action.data.features, 'features', []).forEach((feature) => {
          let id = feature.properties.id;
          feature.properties.admin_id = 'YEM' + id;
        });
      }
      set(state, ['geography', action.data.name], action.data.features);
      break;
  }
  return state;
}
