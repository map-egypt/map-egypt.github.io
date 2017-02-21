'use strict';

export const getDonorName = function (donor, lang) {
  if (lang === 'ar' && donor.donor_name_ar) {
    return donor.donor_name_ar;
  } else {
    return donor.donor_name;
  }
};

export const getProjectName = function (project, lang) {
  if (lang === 'ar' && project.name_ar) {
    return project.name_ar;
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
