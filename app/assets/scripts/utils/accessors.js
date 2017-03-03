'use strict';

export const getDonorName = function (donor, lang) {
  if (lang === 'ar' && donor.donor_nameAr) {
    return donor.donor_nameAr;
  } else {
    return donor.donor_name;
  }
};

export const getProjectName = function (project, lang) {
  if (lang === 'ar' && project.nameAr) {
    return project.nameAr;
  } else {
    return project.name;
  }
};

export const getDescription = function (project, lang) {
  if (lang === 'ar' && project.description_ar) {
    return project.description_ar;
  } else {
    return project.description;
  }
};
