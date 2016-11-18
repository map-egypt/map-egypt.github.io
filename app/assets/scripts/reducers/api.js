'use strict';
import { AUTHENTICATED } from '../actions';

export const initialState = {
  authenticated: false
};

export default function reducer (state = initialState, action) {
  if (action.type === AUTHENTICATED) {
    return Object.assign({}, state, { authenticated: action.data });
  }
  return state;
}
