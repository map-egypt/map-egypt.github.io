'use strict';
import React from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { debounce, throttle, max } from 'lodash';
import Axis from './axis';
import { byEgy } from '../../utils/governorates';

var HorizontalBarChart = React.createClass({
  displayName: 'HorizontalBarChart',

  propTypes: {
    data: React.PropTypes.array,
    margin: React.PropTypes.object,
    yTitle: React.PropTypes.string,
    xFormat: React.PropTypes.func,
    yFormat: React.PropTypes.func,
    activeProject: React.PropTypes.string,
    lang: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      width: 0,
      tooltipX: 0,
      tooltipY: 0,
      tooltipTitle: null,
      tooltipBody: null,
      tooltip: null
    };
  },

  onWindowResize: function () {
    let rect = this.refs.chartContainer.getBoundingClientRect();
    this.setState({ width: rect.width, height: rect.height });
  },

  mouseover: function (x, y, data) {
    this.setState({
      tooltip: true,
      tooltipX: x,
      tooltipY: y,
      tooltipTitle: data.name,
      tooltipBody: this.props.xFormat ? this.props.xFormat(data.value) : data.value
    });
  },

  mouseout: function () {
    this.setState({ tooltip: false });
  },

  reduceDataChart: function (data, activeProject, size = 8) {
    /*
     returns a data extract (size) that includes activeProject
     */
    const index = data.findIndex(i => (i.name === activeProject));
    // if the index is among the top 'size'
    if (index <= size) {
      return data.slice(0, size);
    }
    // if the index is among the last 'size'
    if (index >= (data.length - size)) {
      return data.slice((data.length - size), data.length);
    }
    // if the index is in the middle
    return data.slice((index - (size / 2 >> 0)), (index + (size / 2 >> 0)));
  },

  componentDidMount: function () {
    // Capture initial width (presumably set in css)
    this.onWindowResize();
    // Debounce event.
    this.onWindowResize = debounce(this.onWindowResize, 200);
    this.mouseover = throttle(this.mouseover, 5);
    window.addEventListener('resize', this.onWindowResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
  },

  render: function () {
    const { width, height } = this.state;
    const { lang, yTitle, activeProject, data } = this.props;

    const rtl = lang === 'ar';
    let margin = Object.assign({}, this.props.margin);
    if (rtl) {
      // reverse margins when arabic
      margin = Object.assign(margin, {
        left: margin.right,
        right: margin.left
      });
    }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // short circut if we have too small an area
    if (innerWidth <= 0) {
      return <div className='chart-container' ref='chartContainer' />;
    }

    const langSelector = rtl ? 'nameAr' : 'name';

    const innerData = this.reduceDataChart(data, activeProject);

    innerData.map((a, i) => {
      let name = a.name;
      if (name && name.length === 7 && name.substring(0, 3) === 'EGY') name = (byEgy(name)[langSelector]);
      if (name && name.length === 6 && name.substring(0, 2) === 'GY') name = byEgy('E' + name)[langSelector];
      innerData[i].name = name;
    });

    const dataNames = innerData.map((a) => a.name);
    const dataValues = innerData.map((a) => a.value);
    const links = innerData.map(a => a.link).filter(Boolean);

    const ordinalScale = scaleBand()
    .paddingInner(0.6)
    .paddingOuter(0.2);

    let xRange = [0, innerWidth];
    let xScale = scaleLinear().range([0, innerWidth]).domain([0, max(dataValues)]);
    let axisScale = rtl ? scaleLinear().range([innerWidth, 0]).domain([0, max(dataValues)]) : xScale;
    let xLabels = xScale.ticks(3);
    let yScale = ordinalScale.rangeRound([innerHeight, 0]).domain(dataNames);
    let yLabels = dataNames;
    let rectHeight = yScale.bandwidth();

    return (
      <div className='chart-container' ref='chartContainer'>
        <svg className='chart' width='100%' height={height} ref='svg'>
          <Axis
            scale={axisScale}
            labels={xLabels}
            orientation='bottom'
            height={innerHeight}
            width={innerWidth}
            margin={margin}
            format={this.props.xFormat}
          />
          <Axis
            scale={yScale}
            labels={yLabels}
            orientation={rtl ? 'right' : 'left'}
            height={innerHeight}
            width={innerWidth}
            margin={margin}
            format={this.props.yFormat}
            links={links}
          />
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {innerData.map((d, i) => {
              let active = d.name === activeProject ? ' active' : '';
              let rectWidth = xScale(d.value);
              let x = rtl ? xRange[1] - rectWidth : 0;
              return <rect
                key={d.name + i}
                className={'chart__bar' + active}
                y={yScale(d.name) + rectHeight / 3}
                x={x}
                height={rectHeight}
                width={xScale(d.value)}
                onMouseMove={(event) => this.mouseover(event.clientX, event.clientY, d)}
                onMouseOut={this.mouseout}
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

        <div className='tooltip' style={{
          position: 'fixed',
          display: this.state.tooltip ? 'block' : 'none',
          left: this.state.tooltipX,
          top: this.state.tooltipY}}>
          <div className='tooltip__inner'>
            <h4 className='tooltip__title'>{this.state.tooltipTitle}</h4>
            <p className='tooltip__body'>{this.state.tooltipBody}</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = HorizontalBarChart;
