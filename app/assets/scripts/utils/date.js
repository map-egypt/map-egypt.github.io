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

module.exports.formatDate = function (date, lang) {
  if (!date) {
    return false;
  }
  const d = new Date(date);

  return lang === 'ar'
    ? `${d.getFullYear()}/${d.getDate()}/${d.getMonth() + 1}`
    : `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

// returns MONTH/YEAR
module.exports.formatSimpleDate = function (date) {
  if (!date) {
    return false;
  }
  const d = new Date(date);
  return (d.getMonth() + 1) + '/' + d.getFullYear();
};
