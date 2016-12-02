'use strict';

const governorates = [
  {egy: 'EGY1158', name: 'Red Sea', id: 31},
  {egy: 'EGY1159', name: 'Behera', id: 18},
  {egy: 'EGY1160', name: 'Dakahlia', id: 12},
  {egy: 'EGY1161', name: 'Fayoum', id: 23},
  {egy: 'EGY1162', name: 'Gharbia', id: 16},
  {egy: 'EGY1163', name: 'Alexandria', id: 2},
  {egy: 'EGY1164', name: 'Giza', id: 21},
  {egy: 'EGY1165', name: 'Menoufia', id: 17},
  {egy: 'EGY1166', name: 'Menia', id: 24},
  {egy: 'EGY1167', name: 'Cairo', id: 1},
  {egy: 'EGY1168', name: 'Qalyoubia', id: 14},
  {egy: 'EGY1169', name: 'New Valley', id: 32},
  {egy: 'EGY1170', name: 'Ismailia', id: 19},
  {egy: 'EGY1171', name: 'Suez', id: 4},
  {egy: 'EGY1172', name: 'Sharqia', id: 13},
  {egy: 'EGY1173', name: 'Aswan', id: 28},
  {egy: 'EGY1174', name: 'Asyout', id: 25},
  {egy: 'EGY1175', name: 'Beni-Suef', id: 22},
  {egy: 'EGY1176', name: 'Port Said', id: 3},
  {egy: 'EGY1177', name: 'Damietta', id: 11},
  {egy: 'EGY1178', name: 'South Sinai', id: 35},
  {egy: 'EGY1179', name: 'Kafr-ElSheikh', id: 15},
  {egy: 'EGY1180', name: 'Matrouh', id: 33},
  {egy: 'EGY1181', name: 'Qena', id: 27},
  {egy: 'EGY1182', name: 'North Sinai', id: 34},
  {egy: 'EGY1183', name: 'Sohag', id: 26},
  {egy: 'EGY1184', name: 'Luxor', id: 29}
];

module.exports.byId = function (id) {
  id = +id;
  const result = governorates.find((d) => d.id === id);
  return result;
};

module.exports.byEgy = function (egy) {
  const result = governorates.find((d) => d.egy === egy);
  return result;
};

module.exports.governorates = governorates;
