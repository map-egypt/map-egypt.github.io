'use strict';
import React from 'react';
import window from 'global/window';
import bbox from '@turf/bbox';

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
    location: React.PropTypes.object
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

  componentWillUnmount: function () {
    this.map.remove();
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.location && (!this.props.location || JSON.stringify(newProps.location) !== JSON.stringify(this.props.location))) {
      this.fitMap(newProps);
    }
  },

  mountMap: function (el) {
    if (el) {
      this.map = window.L.mapbox.map(el, null, {
        scrollWheelZoom: false
      });
      window.L.tileLayer(tileLayer).addTo(this.map);
    }
    this.fitMap(this.props);
  },

  render: function () {
    return (<div className='map__container' ref={this.mountMap}></div>);
  }
});

module.exports = Map;
