'use strict';

import test from 'ava';
import { parseProjectDate } from '../../app/assets/scripts/utils/date';

test('#parseProjectDate', function (t) {
  const badformat = parseProjectDate('2001');
  t.false(badformat);

  const date1 = new Date(2000, 0).getTime();
  const date2 = parseProjectDate('2000/1');
  t.is(date1, date2, 'date parsing matches');
});
