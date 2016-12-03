'use strict';
import Lock from 'auth0-lock';
import store from 'store';
import decode from 'jwt-decode';
import { authDomain, authClientId } from '../config';

let auth;
// auth0.js fails our node-based tests, so just don't include it.
if (process.env.DS_ENV === 'testing') {
  auth = {on: () => true};
} else {
  auth = new Lock(authClientId, authDomain, {
    theme: { primaryColor: '#55CBC9',
    logo: 'assets/graphics/layout/logo.svg' }
  });
}

function getTokenExpirationDate (token) {
  const decoded = decode(token);

  if (!decoded.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
}

function isTokenExpired (token) {
  const date = getTokenExpirationDate(token);
  const offsetSeconds = 3600; // Expire an hour before
  if (date === null) {
    return false;
  }

  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
}

const token = store.get('id_token');
const isExpired = token && isTokenExpired(token);
let isAuthenticated = !!token && !isExpired;

// remove token if it's expired
if (token && isExpired) {
  store.remove('id_token');
}

const dispatches = [];
auth.on('authenticated', function (authResult) {
  // This can run too early and fail to set anything in storage.
  // Wrapping in a timeout fixes it.
  setTimeout(function () {
    store.set('id_token', authResult.idToken);
    isAuthenticated = true;
    dispatches.forEach((d) => d(isAuthenticated));
  }, 0);

  auth.getProfile(authResult.idToken, function (err, profile) {
    if (err) { throw new Error(err); }
    store.set('profile', JSON.stringify(profile));
  });
});

module.exports = {
  login: () => auth.show(),
  logout: () => {
    store.remove('id_token');
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
