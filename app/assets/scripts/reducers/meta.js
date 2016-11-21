'use strict';
import { LANGUAGE } from '../actions';

export const initialState = {
  lang: null
};

export default function reducer (state = initialState, action) {
  if (action.type === LANGUAGE) {
    return Object.assign({}, state, { lang: action.data });
  }
  return state;
}
