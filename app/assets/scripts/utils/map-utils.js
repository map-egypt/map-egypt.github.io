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

module.exports.getProjectCentroids = function (projects, features) {
  const markers = [];
  if (!(features[GOVERNORATE] && features[DISTRICT]) || !projects.length) {
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
    let type = regions[id].type;

    console.log('type: ', type);
    console.log('id: ', id);

    if (type === 'district') {
      meta = districtsMeta.byId(id);
      if (meta) {
        feature = districts.find((f) => f.properties.Qism_Mar_1 === meta.id);
      } else {
        console.warn('Error- District metadata not found; falling back to governorate in map');
        type = 'governorate';
        id = regions[id].fallback;
        console.log('fallback id: ', id);
      }
    }

    if (type === 'governorate') {
      meta = governoratesMeta.byId(id);
      feature = egy2.find((f) => f.properties.admin_id === meta.egy);
    }

    const centroid = get(getCentroid(feature), 'geometry.coordinates');
    if (centroid) {
      regions[id].regions.forEach(function (project) {
        markers.push({
          centroid: [centroid[1], centroid[0]],
          ontime: isOntime(project),
          region: meta.region,
          name: meta.name,
          id: project.id
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
