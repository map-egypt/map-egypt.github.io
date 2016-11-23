'use strict';
import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { debounce, max } from 'lodash';
import Axis from './axis';

var HorizontalBarChart = React.createClass({
  displayName: 'HorizontalBarChart',

  propTypes: {
    data: React.PropTypes.array,
    margin: React.PropTypes.object,
    yTitle: React.PropTypes.string,
    xTitle: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      width: 0
    };
  },

  onWindowResize: function () {
    let rect = this.refs.chartContainer.getBoundingClientRect();
    this.setState({ width: rect.width, height: rect.height });
  },

  componentDidMount: function () {
    // Capture initial width (presumably set in css)
    this.onWindowResize();
    // Debounce event.
    this.onWindowResize = debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
  },

  render: function () {
    const { width, height } = this.state;
    const { data, margin, yTitle, xTitle } = this.props;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // short circut if we have too small an area
    if (innerWidth <= 0) {
      return <div className='chart-container' ref='chartContainer' />;
    }

    const dataNames = data.map(a => a.name);
    const dataValues = data.map(a => a.value);

    const ordinalScale = scaleBand()
    .paddingInner(0.7)
    .paddingOuter(0.1);

    let xScale = scaleLinear().range([0, innerWidth]).domain([0, max(dataValues)]);
    let xLabels = xScale.ticks(3);
    let yScale = ordinalScale.rangeRound([innerHeight, 0]).domain(dataNames);
    let yLabels = dataNames;
    let rectHeight = yScale.bandwidth();

    return (
      <div className='chart-container' ref='chartContainer'>
        <svg className='chart' width={width} height={height} ref='svg'>
          <Axis
            scale={xScale}
            labels={xLabels}
            orientation='bottom'
            height={height}
            width={width}
            margin={margin}
          />
          <Axis
            scale={yScale}
            labels={yLabels}
            orientation='left'
            height={height}
            width={width}
            margin={margin}
          />
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {data.map(d => {
              return <rect
                key={d.name}
                className='chart__bar'
                y={yScale(d.name) + rectHeight / 2}
                x={0}
                height={rectHeight}
                width={xScale(d.value)}
              />;
            })}
          </g>
          <text
            x={-(height / 2) + 24}
            y={4}
            dy={'1em'}
            transform={'rotate(-90)'}
            textAnchor={'middle'}
            className={'chart__axis-title'}
            >{yTitle}</text>

        </svg>
      </div>
    );
  }
});

module.exports = HorizontalBarChart;
