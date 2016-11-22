import { combineReducers } from 'redux';

import api from './api';
import meta from './meta';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  meta
};

export default combineReducers(Object.assign({}, reducers, {
}));
