'use strict';

const governorates = [
  {'yem': 'YEM11', 'name': 'Ibb', 'id': 11, 'nameAr': 'إب'},
  {'yem': 'YEM16', 'name': 'Al Jawf', 'id': 16, 'nameAr': 'الجوف'},
  {'yem': 'YEM18', 'name': 'Al Hodieda', 'id': 18, 'nameAr': 'الحديده'},
  {'yem': 'YEM13', 'name': 'Sana\'a City', 'id': 13, 'nameAr': 'أمانة العاصمة'},
  {'yem': 'YEM12', 'name': 'Abyan', 'id': 12, 'nameAr': 'أبين'},
  {'yem': 'YEM14', 'name': 'Al Baidha', 'id': 14, 'nameAr': 'البيضاء'},
  {'yem': 'YEM30', 'name': 'Addhale', 'id': 30, 'nameAr': 'الضالع'},
  {'yem': 'YEM27', 'name': 'Al Mahweet', 'id': 27, 'nameAr': 'المحويت'},
  {'yem': 'YEM28', 'name': 'Al Mahara', 'id': 28, 'nameAr': 'المهره'},
  {'yem': 'YEM20', 'name': 'Dhamar', 'id': 20, 'nameAr': 'ذمار'},
  {'yem': 'YEM15', 'name': 'Taiz', 'id': 15, 'nameAr': 'تعز'},
  {'yem': 'YEM31', 'name': 'Rayma', 'id': 31, 'nameAr': 'ريمة'},
  {'yem': 'YEM17', 'name': 'Hajja', 'id': 17, 'nameAr': 'حجه'},
  {'yem': 'YEM21', 'name': 'Shabwa', 'id': 21, 'nameAr': 'شبوة'},
  {'yem': 'YEM22', 'name': 'Sa\'ada', 'id': 22, 'nameAr': 'صعدة'},
  {'yem': 'YEM23', 'name': 'Sana\'a', 'id': 23, 'nameAr': 'صنعاء'},
  {'yem': 'YEM29', 'name': 'Amran', 'id': 29, 'nameAr': 'عمران'},
  {'yem': 'YEM25', 'name': 'Laheg', 'id': 25, 'nameAr': 'لحج'},
  {'yem': 'YEM26', 'name': 'Mareb', 'id': 26, 'nameAr': 'مأرب'}
];

module.exports.byId = function (id) {
  id = +id;
  const result = governorates.find((d) => d.id === id);
  return result;
};

module.exports.byYem = function (yem) {
  const result = governorates.find((d) => d.yem === yem);
  return result;
};

module.exports.byName = function (name) {
  const result = governorates.find((d) => d.name === name);
  return result;
};

module.exports.governorates = governorates;
