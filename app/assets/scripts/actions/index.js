import auth from '../utils/auth';

export const ACTION = 'ACTION';
export const AUTHENTICATED = 'AUTHENTICATED';

export function hideModalAbout () {
  return { type: ACTION };
}

export function updateAuth (data) {
  return { type: AUTHENTICATED, data: data };
}

export function getAuthStatus () {
  return function (dispatch) {
    auth.registerDispatch(function (isAuthenticated) {
      dispatch(updateAuth(isAuthenticated));
    });
  };
}
