'use strict';
import numeral from 'numeral';

const tally = (n) => numeral(n).format('0,0');
module.exports.tally = tally;

const shortTally = (n) => {
  if (n >= 1000000) {
    return numeral(n / 1000000).format('0,0.[00]') + 'M';
  } else if (n >= 1000) {
    return numeral(n / 1000).format('0,0.[00]') + 'K';
  }
  return tally(n);
};
module.exports.shortTally = shortTally;

function pct (n) {
  if (n || typeof n === 'number') {
    return n + '%';
  }
  return n;
}
module.exports.pct = pct;
