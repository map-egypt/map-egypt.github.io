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
    const { scale, labels, orientation, height, width, margin } = this.props;
    let transform, dy, dx, textAnchor;
    switch (orientation) {
      case 'left':
        transform = `translate(${margin.left},${margin.top})`;
        dy = '0.5em';
        dx = -5;
        textAnchor = 'end';
        break;
      case 'right':
        transform = `translate(${margin.left + width},${margin.top})`;
        dy = '0.5em';
        dx = 5;
        textAnchor = 'start';
        break;
      case 'bottom':
      default:
        transform = `translate(${margin.left},${height + margin.top})`;
        dy = '1em';
        dx = 0;
        textAnchor = 'middle';
        break;
    }

    const format = this.props.format || defaultFormat;
    const hasLinks = this.props.links && Array.isArray(this.props.links) && this.props.links.length;
    const horizontal = orientation === 'left' || orientation === 'right';

    return (
      <g className={'axis axis__' + orientation} transform={transform}>
        {labels.map((label, i) => {
          let x, y;
          if (horizontal) {
            x = 0;
            y = scale(label) + (typeof scale.bandwidth === 'function' ? scale.bandwidth() / 1.5 : 0);
          } else {
            x = scale(label) + (typeof scale.bandwidth === 'function' ? scale.bandwidth() / 2 : 0);
            y = 5;
          }

          let text = (<text
            key={label + i}
            className='chart__axis-ticks'
            x={x}
            y={y}
            dy={dy}
            dx={dx}
            textAnchor={textAnchor}
            >
            {format(label)}
          </text>);
          return hasLinks ? <Link to={this.props.links[i]} key={label}>{text}</Link> : text;
        })}
        <line
          className='chart__axis--line'
          x1='0'
          y1='0'
          x2={horizontal ? 0 : width }
          y2={horizontal ? height : 0 }
        />
      </g>
    );
  }
});

module.exports = Axis;
