'use strict';
import numeral from 'numeral';

const tally = (n) => numeral(n).format('0,0');
module.exports.tally = tally;

const shortTally = (n, t) => {
  if (n >= 1000000000) {
    return numeral(n / 1000000000).format('0,0.[00]') + t.total_currency_B;
  } else if (n >= 1000000) {
    return numeral(n / 1000000).format('0,0.[00]') + t.total_currency_M;
  } else if (n >= 1000) {
    return numeral(n / 1000).format('0,0.[00]') + t.total_currency_K;
  }
  return tally(n);
};
module.exports.shortTally = shortTally;

const shorterTally = (n, t) => {
  if (n >= 1000000000) {
    return numeral(n / 1000000000).format('0,0') + ' ' + t.total_currency_B;
  } else if (n >= 1000000) {
    return numeral(n / 1000000).format('0,0') + ' ' + t.total_currency_M;
  } else if (n >= 1000) {
    return numeral(n / 1000).format('0,0') + t.total_currency_K;
  }
  return tally(n);
};
module.exports.shorterTally = shorterTally;

function pct (n) {
  if (n || typeof n === 'number') {
    return n + '%';
  }
  return n;
}
module.exports.pct = pct;

function shortText (s, length) {
  length = length || 20;
  return s.slice(0, length) + '...';
}
module.exports.shortText = shortText;

function shortParagraph (s, wordCountTarget) {
  wordCountTarget = wordCountTarget || 25;
  let result = s.split(' ');
  let suffix = '';
  if (result.length > wordCountTarget) {
    result = result.slice(0, wordCountTarget);
    suffix = '...';
  }
  return result.join(' ') + suffix;
}
module.exports.shortParagraph = shortParagraph;

function roundedNumber (n, decimalPlaces = 1) {
  let base = Math.pow(10, decimalPlaces);
  let multipled = Math.round(n * base);
  return multipled / base;
}
module.exports.roundedNumber = roundedNumber;

const currency = (value, currencyValue) => currencyValue + ' ' + value.toString();
module.exports.currency = currency;
