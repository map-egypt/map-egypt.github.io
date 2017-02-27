'use strict';

const governorates = [
  {'yem': 'YEM01', 'name': 'Ibb', 'id': 11, 'nameAr': 'إب'},
  {'yem': 'YEM02', 'name': 'Al Jawf', 'id': 16, 'nameAr': 'الجوف'},
  {'yem': 'YEM03', 'name': 'Al Hodieda', 'id': 18, 'nameAr': 'الحديده'},
  {'yem': 'YEM04', 'name': 'Sana\'a City', 'id': 13, 'nameAr': 'أمانة العاصمة'},
  {'yem': 'YEM05', 'name': 'Abyan', 'id': 12, 'nameAr': 'أبين'},
  {'yem': 'YEM06', 'name': 'Al Baidha', 'id': 14, 'nameAr': 'البيضاء'},
  {'yem': 'YEM07', 'name': 'Addhale', 'id': 30, 'nameAr': 'الضالع'},
  {'yem': 'YEM08', 'name': 'Al Mahweet', 'id': 27, 'nameAr': 'المحويت'},
  {'yem': 'YEM09', 'name': 'Al Mahara', 'id': 28, 'nameAr': 'المهره'},
  {'yem': 'YEM10', 'name': 'Dhamar', 'id': 20, 'nameAr': 'ذمار'},
  {'yem': 'YEM11', 'name': 'Taiz', 'id': 15, 'nameAr': 'تعز'},
  {'yem': 'YEM12', 'name': 'Rayma', 'id': 31, 'nameAr': 'ريمة'},
  {'yem': 'YEM13', 'name': 'Hajja', 'id': 17, 'nameAr': 'حجه'},
  {'yem': 'YEM14', 'name': 'Shabwa', 'id': 21, 'nameAr': 'شبوة'},
  {'yem': 'YEM15', 'name': 'Sa\'ada', 'id': 22, 'nameAr': 'صعدة'},
  {'yem': 'YEM16', 'name': 'Sana\'a', 'id': 23, 'nameAr': 'صنعاء'},
  {'yem': 'YEM17', 'name': 'Amran', 'id': 29, 'nameAr': 'عمران'},
  {'yem': 'YEM18', 'name': 'Laheg', 'id': 25, 'nameAr': 'لحج'},
  {'yem': 'YEM19', 'name': 'Mareb', 'id': 26, 'nameAr': 'مأرب'}
];

module.exports.byId = function (id) {
  id = +id;
  const result = governorates.find((d) => d.id === id);
  return result;
};

module.exports.byEgy = function (yem) {
  const result = governorates.find((d) => d.yem === yem);
  return result;
};

module.exports.byName = function (name) {
  const result = governorates.find((d) => d.name === name);
  return result;
};

module.exports.governorates = governorates;
