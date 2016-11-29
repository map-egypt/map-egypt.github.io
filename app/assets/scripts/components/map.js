'use strict';
import React from 'react';
import window from 'global/window';

const tileLayer = 'https://api.mapbox.com/styles/v1/map-egypt/civld9uy0000n2kmnd7lqs3ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwLWVneXB0IiwiYSI6ImNpdmxkMjl6bTA3c2YyeXBvNDJnZDlqZGMifQ.KQSizb18ILr6wri0cBcd2Q';

const Map = React.createClass({
  displayName: 'Map',

  propTypes: {
    api: React.PropTypes.object
  },

  componentWillUnmount: function () {
    this.map.remove();
  },

  mountMap: function (el) {
    if (el) {
      this.map = window.L.mapbox.map(el, null, {
        scrollWheelZoom: false
      });
      window.L.tileLayer(tileLayer).addTo(this.map);
      this.map.fitBounds([
        [22.278144, 25.127830],
        [31.118067, 33.719138]
      ]);
    }
  },

  render: function () {
    return (<div className='map__container' ref={this.mountMap}></div>);
  }
});

module.exports = Map;
