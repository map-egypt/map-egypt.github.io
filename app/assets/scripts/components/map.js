'use strict';
import React from 'react';
import window from 'global/window';
import bbox from '@turf/bbox';
import { scaleQuantile, scaleOrdinal } from 'd3-scale';
import { extend, uniq } from 'lodash';
import { get } from 'object-path';
import { byEgy, byName } from '../utils/governorates';
import { isNumerical } from '../utils/is-numerical-overlay';
import { roundedNumber } from '../utils/format';
const L = window.L;

const tileLayer = 'https://api.mapbox.com/styles/v1/map-egypt/civld9uy0000n2kmnd7lqs3ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwLWVneXB0IiwiYSI6ImNpdmxkMjl6bTA3c2YyeXBvNDJnZDlqZGMifQ.KQSizb18ILr6wri0cBcd2Q';
const satelliteLayer = 'mapbox.satellite';

const BOUNDS = [
  [22.278144, 25.127830],
  [31.118067, 33.719138]
];

const SEQUENTIAL = [
  '#f7fbff',
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#084594'
];

const DIVERGENT = [
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee090',
  '#e0f3f8',
  '#abd9e9',
  '#74add1',
  '#4575b4'
];

const OVERLAY_STYLE = {
  weight: 1,
  opacity: 1,
  color: 'white',
  fillOpacity: 0.5
};

function getLatLngBounds (bounds) {
  let b = bbox(bounds);
  let result = [[b[1], b[0]], [b[3], b[2]]];
  return result;
}

const Map = React.createClass({
  displayName: 'Map',

  propTypes: {
    lang: React.PropTypes.string,
    location: React.PropTypes.object,
    markers: React.PropTypes.array,
    overlay: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      activeProject: true,
      activeIndicator: false,
      overlayScale: false
    };
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

  addClusterMarkers: function (markers, lang) {
    lang = lang || 'en';
    const locationLang = lang === 'en' ? 'name' : 'nameAr';
    const markerLayer = this.markerLayer;
    markerLayer.clearLayers();
    markers.forEach(function (marker) {
      const leafletMarker = L.marker(marker.centroid, {
        icon: L.mapbox.marker.icon({'marker-symbol': 'circle', 'marker-color': '2B2342'})
      });

      let status = marker.ontime ? 'On Time' : 'Delayed';
      let statusClass = marker.ontime ? 'project--ontime' : 'project--delayed';

      leafletMarker.bindPopup(
        `<div class='marker__internal'>` +
          `<h5 class='marker__title'><a href='#/${lang}/projects/${marker.id}' class='link--deco'>${marker.name}</a></h5>` +
          `<dl class='card-meta ${statusClass}'>` +
                `<dt class='card-meta__label'>Status</dt>` +
                `<dd class='card-meta__value card-meta__value--status'>${status}</dd>` +
                `<dt class='card-meta__label'>Location</dt>` +
                `<dd class='card-meta__value card-meta__value--location'>${byName(marker.region)[locationLang]}</dd>` +
              `</dl>` +
        `</div>`
      );
      markerLayer.addLayer(leafletMarker);
    });
  },

  renderOverlay: function (overlay) {
    if (this.overlay) {
      this.overlay.remove();
    }
    if (!overlay) { return false; }
    const { values, regions } = overlay;

    // normalize category
    let { category } = overlay;
    if (!category) {
      category = isNumerical(values) ? 'diverging' : 'categorical';
    } else if (category !== 'categorical' && !isNumerical(values)) {
      category = 'categorical';
    }

    let domain, scale;
    if (category) {
      switch (category.toLowerCase()) {
        case 'sequential':
          domain = values.map(d => +d.value);
          scale = scaleQuantile().domain(domain).range(SEQUENTIAL.slice(0, 5));
          break;

        case 'diverging':
        case 'divergent':
          domain = values.map(d => +d.value);
          scale = scaleQuantile().domain(domain).range(DIVERGENT.slice(0, 5));
          break;

        case 'categorical':
        default:
          domain = uniq(values.map(d => d.value)).sort((a, b) => a < b ? 1 : -1);
          let l = DIVERGENT.length;
          if (domain.length > l) {
            console.log('WARNING: categorical data for this indicator contains too many unique categories');
            console.log('Shortening the number of indicators to', l);
            domain = domain.slice(0, l);
          }
          scale = scaleOrdinal().domain(domain).range(DIVERGENT.slice(0, domain.length));
          break;
      }
    }

    const style = (feature) => {
      if (!feature.properties._value) {
        return OVERLAY_STYLE;
      }
      return extend({
        fillColor: scale(feature.properties._value)
      }, OVERLAY_STYLE);
    };

    const idMap = {};
    values.forEach((value) => {
      idMap[value.id] = category === 'categorical' ? value.value : +value.value;
    });

    regions.features.forEach(function (feature) {
      feature.properties._value = get(idMap, feature.properties.admin_id);
    });

    // for district features, use the geojson to determine district name
    const isDistrict = regions.features.length > 300;
    const districtNameMap = {};
    if (isDistrict) {
      regions.features.forEach(function (feature) {
        districtNameMap[feature.properties.admin_id] = feature.properties.District;
      });
    }

    this.overlay = L.geoJson(regions, { style }).bindPopup(function ({ feature }) {
      const id = feature.properties.admin_id;
      const name = isDistrict ? districtNameMap[id] : get(byEgy(id), 'name');
      return `
      <div class='marker__internal'>
        <h5 class='marker__title'>${name}</h5>
        <p class='marker__description'>Value: <strong>${get(feature, 'properties._value', '--')}</strong></p>
      </div>
      `;
    }).addTo(this.overlayLayer);

    return scale;
  },

  componentWillUnmount: function () {
    this.map.remove();
  },

  componentWillReceiveProps: function (props) {
    if (props.location && (!this.props.location || JSON.stringify(props.location) !== JSON.stringify(this.props.location))) {
      this.fitMap(props);
    }

    if (props.markers && (!this.props.markers || props.markers.length !== this.props.markers.length ||
        JSON.stringify(props.markers) !== JSON.stringify(this.props.markers) || props.lang !== this.props.lang)) {
      this.addClusterMarkers(props.markers, props.lang);
    }

    if ((props.overlay && (!this.props.overlay || props.overlay.id !== this.props.overlay.id)) || (this.props.overlay && !props.overlay)) {
      let overlayScale = this.renderOverlay(props.overlay);
      this.setState({overlayScale});
    }
  },

  mountMap: function (el) {
    if (el) {
      this.map = L.mapbox.map(el, null, {
        scrollWheelZoom: false,
        maxZoom: 11
      });

      const layers = {
        Basic: L.tileLayer(tileLayer),
        Satellite: L.mapbox.tileLayer(satelliteLayer)
      };

      layers.Basic.addTo(this.map);
      L.control.layers(layers).addTo(this.map);

      this.overlayLayer = L.featureGroup();
      this.map.addLayer(this.overlayLayer);

      this.markerLayer = L.markerClusterGroup({
        polygonOptions: {
          opacity: 0,
          fillOpacity: 0
        }
      });

      this.map.addLayer(this.markerLayer);

      this.fitMap(this.props);

      const { markers, overlay, lang } = this.props;
      if (markers) {
        this.addClusterMarkers(markers, lang);
      }
      if (overlay) {
        let overlayScale = this.renderOverlay(overlay);
        this.setState({overlayScale});
      }
    }
  },

  renderMarkerLegend: function () {
    const t = get(window.t, [this.props.lang, 'map_labels'], {});
    return (
      <span className='legend__markers'>
        <span className='legend__item legend__marker--cluster'><span className='legend__image legend__image--cluster'>
          <span className='legend__image--cluster--bg'></span>
          <span className='legend__image--cluster--text'>8</span>
        </span>{t.map_group_label}</span>
        <span className='legend__item legend__marker--project'><span className='legend__image legend__image--marker'><img src='assets/graphics/content/map-pin.png' alt='A marker indicates a single project'/></span> {t.map_project_label}</span>
      </span>
    );
  },

  renderOverlayLegend: function (scale) {
    const isQuantile = scale.hasOwnProperty('invertExtent');
    const iterable = (isQuantile ? scale.range() : scale.domain()).sort();
    return (
      <span className='legend__overlay'>
        {iterable.map((d) => {
          let backgroundColor = isQuantile ? d : scale(d);
          let text = isQuantile ? scale.invertExtent(d).map(roundedNumber).join(' - ') : d;
          return (
            <span key={d} className='legend__item legend__overlay--item'>
              <span className='legend__item--overlay--bg' style={{backgroundColor}}></span>
              <span className='legend__item--overlay-text'>{text}</span>
            </span>
          );
        })}
      </span>
    );
  },

  render: function () {
    return (
      <div className='map__group'>
        <div className='map__container' ref={this.mountMap}></div>
        <div className='inner'>
          <div className='legend__container'>
            {this.renderMarkerLegend()}
            {this.state.overlayScale && this.renderOverlayLegend(this.state.overlayScale)}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Map;
