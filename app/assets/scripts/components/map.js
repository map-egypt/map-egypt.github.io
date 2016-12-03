'use strict';
import React from 'react';
import window from 'global/window';
import bbox from '@turf/bbox';
const L = window.L;

const tileLayer = 'https://api.mapbox.com/styles/v1/map-egypt/civld9uy0000n2kmnd7lqs3ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwLWVneXB0IiwiYSI6ImNpdmxkMjl6bTA3c2YyeXBvNDJnZDlqZGMifQ.KQSizb18ILr6wri0cBcd2Q';

const BOUNDS = [
  [22.278144, 25.127830],
  [31.118067, 33.719138]
];

function getLatLngBounds (bounds) {
  let b = bbox(bounds);
  let result = [[b[1], b[0]], [b[3], b[2]]];
  return result;
}

const Map = React.createClass({
  displayName: 'Map',

  propTypes: {
    location: React.PropTypes.object,
    markers: React.PropTypes.array
  },

  fitMap: function (props) {
    let bounds;
    if (props.location) {
      bounds = props.location.type
        ? getLatLngBounds(props.location)
        : props.location;
    } else {
      bounds = BOUNDS;
    }
    this.map.fitBounds(bounds);
  },

  addClusterMarkers: function (markers) {
    const markerLayer = this.markerLayer;
    markerLayer.clearLayers();
    markers.forEach(function (marker) {
      const leafletMarker = L.marker(marker.centroid, {
        icon: L.mapbox.marker.icon({'marker-symbol': 'circle', 'marker-color': '2B2342'})
      });
      leafletMarker.bindPopup(
        `<div class='marker__internal'>` +
          `<h5 class='marker__title'>${marker.name}</h5>` +
          `<dl class='card-meta'>` +
                `<dt class='card-meta__label'>Status</dt>` +
                `<dd class='card-meta__value card-meta__value--status'>Delayed</dd>` +
                `<dt class='card-meta__label'>Location</dt>` +
                `<dd class='card-meta__value card-meta__value--location'>${marker.region}</dd>` +
              `</dl>` +
        `</div>`
      );
      markerLayer.addLayer(leafletMarker);
    });
  },

  componentWillUnmount: function () {
    this.map.remove();
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.location && (!this.props.location || JSON.stringify(newProps.location) !== JSON.stringify(this.props.location))) {
      this.fitMap(newProps);
    }

    if (newProps.markers && newProps.markers.length &&
                              (!this.props.markers || JSON.stringify(newProps.markers) !== JSON.stringify(this.props.markers))) {
      this.addClusterMarkers(newProps.markers);
    }
  },

  mountMap: function (el) {
    if (el) {
      this.map = L.mapbox.map(el, null, {
        scrollWheelZoom: false
      });
      L.tileLayer(tileLayer).addTo(this.map);
      this.markerLayer = L.markerClusterGroup();
      this.map.addLayer(this.markerLayer);
      this.fitMap(this.props);
    }
  },

  render: function () {
    return (<div className='map__container' ref={this.mountMap}></div>);
  }
});

module.exports = Map;
