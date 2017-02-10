'use strict';
import { get } from 'object-path';
import getCentroid from '@turf/centroid';
import * as governoratesMeta from './governorates';
import * as districtsMeta from './districts';
import { isOntime } from '../components/project-card';

const GOVERNORATE = 'egy2';
const DISTRICT = 'districts';
module.exports.GOVERNORATE = GOVERNORATE;
module.exports.DISTRICT = DISTRICT;

// helps to find fallback governorate when district included but missing from spatial data
// http://codereview.stackexchange.com/questions/73714/find-a-nested-property-in-an-object
function findFallback (o, fallbackId) {
  if (o.fallback === fallbackId) {
    return o;
  }
  var result, p;
  for (p in o) {
    if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
      result = findFallback(o[p], fallbackId);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

module.exports.getProjectCentroids = function (projects, features) {
  const markers = [];
  if ((!features[GOVERNORATE] || !features[DISTRICT]) || !projects.length) {
    return markers;
  }

  const regions = {};
  projects.forEach(function (project) {
    let locations = get(project, 'location');
    if (locations && Array.isArray(locations)) {
      locations.forEach(function (location) {
        const region = location.district;
        let metadata;
        region.district.length && region.district.toLowerCase() !== 'all'
          ? metadata = {type: 'district', fallback: region.governorate}
          : metadata = {type: 'governorate', fallback: false};
        const regionId = region[metadata.type];
        regions[regionId] = regions[regionId] || Object.assign(metadata, {regions: []});
        regions[regionId].regions.push(project);
      });
    }
  });

  let {districts, egy2} = features;
  districts = districts.features;
  egy2 = egy2.features;
  Object.keys(regions).forEach(function (id) {
    let meta;
    let feature;
    let badId;
    let type = regions[id].type;

    if (type === 'district') {
      meta = districtsMeta.byId(id);
      if (meta) {
        feature = districts.find((f) => f.properties.Qism_Mar_1 === meta.id);
      } else {
        badId = id;
        id = regions[id].fallback;
        type = 'governorate';
        console.warn(`Error- District ID ${badId} metadata not found; falling back to governorate ID ${id} in map`);
      }
    }

    if (type === 'governorate') {
      meta = governoratesMeta.byId(id);
      feature = egy2.find((f) => f.properties.admin_id === meta.egy);
    }

    const centroid = get(getCentroid(feature), 'geometry.coordinates');
    if (centroid) {
      const region = regions[id] || findFallback(regions, id);
      region.regions.forEach(function (project) {
        markers.push({
          centroid: [centroid[1], centroid[0]],
          ontime: isOntime(project),
          region: meta.name,
          name: project.name,
          id: project.id,
          type: type
        });
      });
    }
  });

  return markers;
};

// encodes an array of markers into a geojson feature collection
module.exports.getFeatureCollection = function (markers) {
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
