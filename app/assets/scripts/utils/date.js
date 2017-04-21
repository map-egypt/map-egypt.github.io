'use strict';

// expects the format '2016/7' for July 2016
module.exports.parseProjectDate = function (date) {
  if (!date) { return false; }
  const split = date.split('/');
  if (split.length !== 2) {
    console.log('Date', date, 'does not match YEAR/MONTH format');
    return false;
  }
  const parsed = new Date(split[0], split[1] - 1); // month is 0-based
  return parsed.getTime();
};

module.exports.formatDate = function (date) {
  if (!date) {
    return false;
  }
  const d = new Date(date);
  return d.toLocaleDateString();
};
