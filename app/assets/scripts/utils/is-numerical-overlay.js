'use strict';
import { find } from 'lodash';

export function isNumerical (values) {
  values = values || [];
  return !find(values, (d) => isNaN(d.value));
}
