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
  if (!features || !projects.length) {
    return markers;
  }

  const regions = {};
  projects.forEach(function (project) {
    let locations = get(project, 'location');
    if (locations && Array.isArray(locations)) {
      locations.forEach(function (location) {
        const region = location.district;
        let type;
        region.district.length && region.district.toLowerCase() !== 'all'
          ? type = 'district'
          : type = 'governorate';
        const regionId = region[type];
        regions[regionId] = regions[regionId] || {type: type, regions: []};
        regions[regionId].regions.push(project);
      });
    }
  });

  let {districts, egy2} = features;
  districts = districts.features;
  egy2 = egy2.features;
  console.log(districts.map((d) => d.properties.Qism_Mar_1))
  Object.keys(regions).forEach(function (id, i) {
    let meta;
    let feature;
    const type = regions[id].type;
    // console.log(type)
    if (type === 'district') {
      console.log(id)
      meta = districtsMeta.byId(id);
      console.log('district meta: ', meta.id);
      feature = districts.find((f) => f.properties.Qism_Mar_1 === meta.id.toString())
    } else if (type === 'governorate') {
      meta = governoratesMeta.byId(id);
      // console.log('governorate meta: ', meta);
      feature = egy2.find((f) => f.properties.admin_id === meta.egy);
    }
    console.log(feature);
    const centroid = get(getCentroid(feature), 'geometry.coordinates');
    if (centroid) {
      regions[id].regions.forEach(function (project) {
        markers.push({
          centroid: [centroid[1], centroid[0]],
          ontime: isOntime(project),
          region: meta.name,
          name: project.name,
          id: project.id
        });
      });
    }
  });

  // console.log(markers)

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
