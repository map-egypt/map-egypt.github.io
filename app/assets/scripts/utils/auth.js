'use strict';
import Lock from 'Auth0-Lock';
import store from 'store2';
import { authDomain, authClientId } from '../config';

var auth;
// auth0.js fails our node-based tests, so just don't include it.
if (process.env.DS_ENV === 'testing') {
  auth = {on: () => true};
} else {
  auth = new Lock(authClientId, authDomain);
}

auth.on('authenticated', function (authResult) {
  store.set('id_token', authResult.idToken);
  store.set('access_token', authResult.accessToken);
  auth.getProfile(authResult.idToken, function (err, profile) {
    if (err) {
      throw new Error(err);
    }
    store.set('profile', JSON.stringify(profile));
  });
});

module.exports = {
  auth: auth,
  login: () => {
    auth.show();
  },
  logout: () => {
    store.remove('id_token');
    store.remove('access_token');
    store.remove('profile');
  },
  authenticated: () => {
    return !!store.get('access_token');
  },
  accessToken: () => { store.get('access_token'); },
  profile: () => {
    const profile = store.get('profile');
    return profile && JSON.parse(profile) || false;
  }
};
