'use strict';
import { get } from 'object-path';
import getCentroid from '@turf/centroid';
import * as governoratesMeta from './governorates';
import * as districtsMeta from './districts';
import { isOntime } from '../components/project-card';

export const GOVERNORATE = 'boundary';
export const DISTRICT = 'districts';

export const hasDistrictData = function (location) {
  let district = get(location, 'district.district', '');
  let shouldBeDistrict = district && district.toLowerCase() !== 'all';
  let hasDistrictMeta = shouldBeDistrict && districtsMeta.ids.indexOf(district) >= 0;
  if (shouldBeDistrict && !hasDistrictMeta) {
    console.log('No metadata for', district, 'falling back to governorate');
  }
  return hasDistrictMeta;
};

export const getProjectCentroids = function (projects, features) {
  const markers = [];
  const districts = get(features, DISTRICT + '.features');
  const governorates = get(features, GOVERNORATE + '.features');
  if (!districts || !governorates || !projects.length) {
    return markers;
  }

  const regions = {};
  projects.forEach(function (project) {
    (get(project, 'location', []) || []).forEach(function (location) {
      const isDistrict = hasDistrictData(location);
      const id = isDistrict ? location.district.district : location.district.governorate;
      regions[id] = regions[id] || { isDistrict, projects: [] };
      regions[id].projects.push(project);
    });
  });

  Object.keys(regions).forEach(function (id) {
    let meta;
    let feature;
    if (regions[id].isDistrict) {
      meta = districtsMeta.byId(id);
      feature = districts.find((f) => f.properties.id === meta.id);
    } else {
      meta = governoratesMeta.byId(id);
      feature = governorates.find((f) => f.properties.governorat * 1 === meta.yem.substring(3) * 1);
    }
    const centroid = get(getCentroid(feature), 'geometry.coordinates');
    if (centroid) {
      regions[id].projects.forEach(function (project) {
        markers.push({
          centroid: [centroid[1], centroid[0]],
          ontime: isOntime(project),
          region: meta.name,
          name: project.name,
          name_ar: project.name_ar,
          id: project.id,
          isDistrict: regions[id].isDistrict
        });
      });
    }
  });

  return markers;
};

// encodes an array of markers into a geojson feature collection
export const getFeatureCollection = function (markers) {
  return {
    type: 'FeatureCollection',
    features: markers.map(m => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [m.centroid[1], m.centroid[0]]
      }
    }))
  };
};
