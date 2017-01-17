'use strict';
import { get } from 'object-path';
import getCentroid from '@turf/centroid';
import * as governorates from './governorates';
import { isOntime } from '../components/project-card';

module.exports.GOVERNORATE = 'egy2';

module.exports.getProjectCentroids = function (projects, features) {
  const markers = [];
  if (!features || !projects.length) {
    return markers;
  }

  const regions = {};
  projects.forEach(function (project) {
    get(project, 'location', []).forEach(function (location) {
      // TODO look at district or marker to see if there's more granular data
      const region = location.district.governorate;
      regions[region] = regions[region] || [];
      regions[region].push(project);
    });
  });

  Object.keys(regions).forEach(function (id) {
    const meta = governorates.byId(id);
    const feature = features.find((f) => f.properties.admin_id === meta.egy);
    const centroid = get(getCentroid(feature), 'geometry.coordinates');
    if (centroid) {
      regions[id].forEach(function (project) {
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
