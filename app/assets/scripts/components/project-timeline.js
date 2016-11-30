'use strict';
import React from 'react';
import { scaleTime } from 'd3';
import { parseProjectDate, formatDate } from '../utils/date';

var ProjectTimeline = React.createClass({
  displayName: 'ProjectTimeline',

  propTypes: {
    project: React.PropTypes.object
  },

  render: function () {
    const project = this.props.project;

    const plannedStart = parseProjectDate(project.planned_start_date);
    const plannedEnd = parseProjectDate(project.planned_end_date);

    const actualStart = project.actual_start_date ? parseProjectDate(project.actual_start_date) : null;
    const actualEnd = project.actual_end_date ? parseProjectDate(project.actual_end_date) : null;

    const start = actualStart ? Math.min(plannedStart, actualStart) : plannedStart;
    const end = actualEnd ? Math.max(plannedEnd, actualEnd) : plannedEnd;

    const scale = scaleTime().domain([new Date(start), new Date(end)]).range([0, 100]);

    return (
      <div className='timeline'>
        <div className='timeline__unit'>
          <h5 className='timeline__headline heading-alt'>Current Progress</h5>
          {actualStart && actualEnd && timeline(actualStart, actualEnd, scale)}
        </div>
        <div className='timeline__unit'>
          <h5 className='timeline__headline heading-alt'>Proposed Timeline</h5>
          {timeline(plannedStart, plannedEnd, scale)}
        </div>
      </div>
    );
  }
});

module.exports = ProjectTimeline;

function timeline (start, end, scale) {
  const left = scale(new Date(start));
  const right = scale(new Date(end));
  const width = right - left;
  return (
    <div className='timeline__row'>
      <div className='timeline__inner' style={{
        left: left + '%',
        width: width + '%'
      }}>
      </div>
      <hr style={{ left: left + '%' }} />
      <hr style={{ left: right + '%' }} />
      <h5 className='timeline__label' style={{ left: left + '%' }}>{formatDate(start)}</h5>
      <h5 className='timeline__label timeline__label--right' style={{ right: (100 - right) + '%' }}>{formatDate(end)}</h5>
    </div>
  );
}
