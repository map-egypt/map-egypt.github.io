'use strict';

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
