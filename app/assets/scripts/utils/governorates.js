'use strict';

const governorates = [
  {'egy': 'EGY1163', 'name': 'Alexandria', 'id': 2, 'nameAr': 'اسكندرية'},
  {'egy': 'EGY1173', 'name': 'Aswan', 'id': 28, 'nameAr': 'أسوان'},
  {'egy': 'EGY1174', 'name': 'Asyout', 'id': 25, 'nameAr': 'أسيوط'},
  {'egy': 'EGY1159', 'name': 'Behera', 'id': 18, 'nameAr': 'البحيرة'},
  {'egy': 'EGY1175', 'name': 'Beni-Suef', 'id': 22, 'nameAr': 'بني سويف'},
  {'egy': 'EGY1167', 'name': 'Cairo', 'id': 1, 'nameAr': 'القاهرة'},
  {'egy': 'EGY1160', 'name': 'Dakahlia','id': 12, 'nameAr': 'الدقهلية'},
  {'egy': 'EGY1177', 'name': 'Damietta', 'id': 11, 'nameAr': 'دمياط'},
  {'egy': 'EGY1161', 'name': 'Fayoum', 'id': 23, 'nameAr': 'الفيوم'},
  {'egy': 'EGY1162', 'name': 'Gharbia','id': 16, 'nameAr': 'الغربية'},
  {'egy': 'EGY1164', 'name': 'Giza', 'id': 21, 'nameAr': 'الجيزة'},
  {'egy': 'EGY1170', 'name': 'Ismailia', 'id': 19, 'nameAr': 'الإسماعيلية'},
  {'egy': 'EGY1179', 'name': 'Kafr-ElSheikh', 'id': 15, 'nameAr': 'كفر الشيخ'},
  {'egy': 'EGY1184', 'name': 'Luxor', 'id': 29, 'nameAr': 'الأقصر'},
  {'egy': 'EGY1180', 'name': 'Matrouh', 'id': 33, 'nameAr': 'مطروح'},
  {'egy': 'EGY1166', 'name': 'Menia', 'id': 24, 'nameAr': 'المنيا'},
  {'egy': 'EGY1165', 'name': 'Menoufia', 'id': 17, 'nameAr': 'المنوفية'},
  {'egy': 'EGY1169', 'name': 'New Valley', 'id': 32, 'nameAr': 'الوادي الجديد'},
  {'egy': 'EGY1182', 'name': 'North Sinai', 'id': 34, 'nameAr': 'شمال سيناء'},
  {'egy': 'EGY1176', 'name': 'Port Said', 'id': 3, 'nameAr': 'بورسعيد'},
  {'egy': 'EGY1168', 'name': 'Qalyoubia', 'id': 14, 'nameAr': 'القليوبية'},
  {'egy': 'EGY1181', 'name': 'Qena', 'id': 27, 'nameAr': 'قنا'},
  {'egy': 'EGY1158', 'name': 'Red Sea', 'id': 31, 'nameAr': 'البحر الأحمر'},
  {'egy': 'EGY1172', 'name': 'Sharqia', 'id': 13, 'nameAr': 'الشرقية'},
  {'egy': 'EGY1183', 'name': 'Sohag', 'id': 26, 'nameAr': 'سوهاج'},
  {'egy': 'EGY1178', 'name': 'South Sinai', 'id': 35, 'nameAr': 'شمال سيناء'},
  {'egy': 'EGY1171', 'name': 'Suez', 'id': 4, 'nameAr': 'السويس'}
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

module.exports.byName = function (name) {
  const result = governorates.find((d) => d.name === name);
  return result;
};

module.exports.governorates = governorates;
