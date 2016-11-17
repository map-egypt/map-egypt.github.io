'use strict';
import Lock from 'Auth0-Lock';
import store from 'store';
import { authDomain, authClientId } from '../config';

let auth;
// auth0.js fails our node-based tests, so just don't include it.
if (process.env.DS_ENV === 'testing') {
  auth = {on: () => true};
} else {
  auth = new Lock(authClientId, authDomain);
}

let isAuthenticated = !!store.get('access_token');
const dispatches = [];
auth.on('authenticated', function (authResult) {
  store.set('id_token', authResult.idToken);
  store.set('access_token', authResult.accessToken);

  isAuthenticated = true;
  dispatches.forEach((d) => d(isAuthenticated));

  auth.getProfile(authResult.idToken, function (err, profile) {
    if (err) { throw new Error(err); }
    store.set('profile', JSON.stringify(profile));
  });
});

module.exports = {
  login: () => auth.show(),
  logout: () => {
    store.remove('id_token');
    store.remove('access_token');
    store.remove('profile');
  },
  registerDispatch: function (dispatch) {
    if (isAuthenticated) {
      dispatch(isAuthenticated);
    } else {
      dispatches.push(dispatch);
    }
  }
};
