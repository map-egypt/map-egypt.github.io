'use strict'
import React from 'react';
import { connect } from 'react-redux';

const MAP = 'mapbox.mapbox-streets-v7';

const Map = React.createClass({
  displayName: 'Map',

  propTypes: {
  },

  mountMap: function (el) {
    this.map = L.mapbox.map(el, MAP, {});
    L.mapbox.styleLayer('mapbox://styles/ascalamogna/citynzhxe007b2ilf5i9m2ppb').addTo(this.map)
    this.map.fitBounds([
      [22.278144, 25.127830],
      [31.118067, 33.719138]
    ]);
  },

  render: function () {
    return (<div className='map__container' ref={this.mountMap}></div>);
  }
});

function mapStateToProps (state) {
  return {
  };
}

module.exports = connect(mapStateToProps)(Map);
