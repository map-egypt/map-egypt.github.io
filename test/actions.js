import test from 'ava';
import * as actions from '../app/assets/scripts/actions';

/*
 * Tests for bare action creators
 */
test('spot check actions and action creators', function (t) {
  const actionTypes = Object.keys(actions)
    .filter(k => typeof actions[k] === 'string');
  const ID = 'id';
  const actionCreators = Object.keys(actions)
    .filter(k => typeof actions[k] === 'function' && typeof actions[k](ID) === 'object');

  t.deepEqual(actionTypes, actionTypes.map(k => actions[k]),
    'action type constant names match values');

  actionCreators.map(k => actions[k]().type)
    .forEach(type => t.truthy(actionTypes.indexOf(type) >= 0,
      'each action creator creates a known action type: ' + type));
});
