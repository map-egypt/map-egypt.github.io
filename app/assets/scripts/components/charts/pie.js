'use strict';
import React from 'react';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import slugify from '../../utils/slugify';

var PieChart = React.createClass({
  displayName: 'PieChart',

  propTypes: {
    data: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      width: 0,
      height: 0
    };
  },

  onWindowResize: function () {
    let rect = this.refs.chartContainer.getBoundingClientRect();
    this.setState({ width: rect.width, height: rect.height });
  },

  componentDidMount: function () {
    this.onWindowResize();
    this.onWindowResize = debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
  },

  render: function () {
    const { width, height } = this.state;
    const { data } = this.props;
    const radius = Math.min(width, height) / 2;

    // short circut if we have too small an area
    if (radius <= 0) {
      return <div className='chart-container' ref='chartContainer' />;
    }

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const dataValues = d3.pie()
    .value((d) => d.value)(this.props.data);

    const dataNames = data.map(d => d.name);

    return (
      <div className='chart-container' ref='chartContainer'>
        <svg className='chart' width={width} height={height} ref='svg'>
          <g className='arc' transform={`translate(${width / 2}, ${height / 2})`}>
            {dataValues.map((d, i) => {
              return <path
                key={i}
                d={arc(d)}
                className={'pie__slice__' + slugify(dataNames[i])}/>;
            })}
          </g>
        </svg>
      </div>
    );
  }
});

module.exports = PieChart;
