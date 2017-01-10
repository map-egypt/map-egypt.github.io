'use strict';
import React from 'react';
import { Link } from 'react-router';

const defaultFormat = (x) => x;

const Axis = React.createClass({

  propTypes: {
    scale: React.PropTypes.func,
    labels: React.PropTypes.array,
    orientation: React.PropTypes.string,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    margin: React.PropTypes.object,
    format: React.PropTypes.func,
    links: React.PropTypes.array
  },

  render: function () {
    const { scale, labels, orientation, height, margin } = this.props;
    let transform, dy;
    switch (orientation) {
      case 'top':
        transform = `translate(${margin.left},${margin.top})`;
        dy = '-0.5em';
        break;
      case 'left':
        transform = `translate(0,${margin.top})`;
        dy = '0.5em';
        break;
      case 'bottom':
      default:
        transform = `translate(${margin.left},${height - margin.bottom})`;
        dy = '1em';
    }

    const format = this.props.format || defaultFormat;
    const domain = scale.domain();
    const hasLinks = this.props.links && Array.isArray(this.props.links) && this.props.links.length;

    return (
      <g className={'axis axis__' + orientation} transform={transform}>
        {labels.map((label, i) => {
          let text = (<text
            key={label + i}
            className='chart__axis-ticks'
            x={orientation === 'left' ? margin.left - 5 : scale(label) + (typeof scale.bandwidth === 'function' ? scale.bandwidth() / 2 : 0)}
            y={orientation === 'left' ? scale(label) + (typeof scale.bandwidth === 'function' ? scale.bandwidth() / 1.5 : 0) : 5 }
            dy={dy}
            textAnchor={orientation === 'left' ? 'end' : 'middle'}
            >
            {format(label)}
          </text>);
          return hasLinks ? <Link to={this.props.links[i]} key={label}>{text}</Link> : text;
        })}
        <line
          className='chart__axis--line'
          x1={orientation === 'left' ? margin.left : 0 }
          y1='0'
          x2={orientation === 'left' ? margin.left : scale(domain[1])}
          y2={orientation === 'left' ? height - margin.bottom - margin.top : 0 }
        />
      </g>
    );
  }
});

module.exports = Axis;
