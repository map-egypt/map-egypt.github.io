import { combineReducers } from 'redux';

import api from './api';

export const reducers = {
  def: (state = {}, action) => state,
  api
};

export default combineReducers(Object.assign({}, reducers, {
}));
