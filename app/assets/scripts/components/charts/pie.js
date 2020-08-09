'use strict';
import React from 'react';
import * as d3 from 'd3';
import { debounce, throttle } from 'lodash';
import slugify from '../../utils/slugify';

var PieChart = React.createClass({
  displayName: 'PieChart',

  propTypes: {
    data: React.PropTypes.array,
    lang: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      width: 0,
      height: 0,
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

  mouseover: function (x, y, name, value) {
    this.setState({
      tooltip: true,
      tooltipX: x,
      tooltipY: y,
      tooltipTitle: name,
      tooltipBody: value
    });
  },

  mouseout: function () {
    this.setState({ tooltip: false });
  },

  componentDidMount: function () {
    this.onWindowResize();
    this.onWindowResize = debounce(this.onWindowResize, 200);
    this.mouseover = throttle(this.mouseover, 15);
    window.addEventListener('resize', this.onWindowResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
  },

  render: function () {
    const { width, height } = this.state;
    const { data, lang } = this.props;
    const radius = Math.min(width, height) / 2;

    // short circut if we have too small an area
    if (radius <= 0) {
      return <div className='chart-container' ref='chartContainer' />;
    }

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(100);

    const dataValues = d3.pie()
    .value((d) => d.value)(this.props.data);

    const names = data.map(d => d.name);
    const namesAr = data.map(d => d.name_ar);
    const rtl = lang === 'ar';
    const langSelector = rtl ? namesAr : names;

    return (
      <div className='chart-container' ref='chartContainer'>
        <svg className='chart' width={width} height={height} ref='svg'>
          <g className='arc' transform={`translate(${width / 2}, ${height / 2})`}>
            {dataValues.map((d, i) => {
               // make values readable with commas
              let valWithCommas = d.value.toString().match(/.{1,4}/g).join(',');
              return <path
                key={i}
                d={arc(d)}
                className={'pie__slice__' + slugify(names[i])}
                onMouseMove={(event) => this.mouseover(event.clientX, event.clientY, langSelector[i], valWithCommas)}
                onMouseOut={this.mouseout}
              />;
            })}
          </g>
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

module.exports = PieChart;
