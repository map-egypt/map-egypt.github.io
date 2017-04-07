'use strict';
import React from 'react';
import { scaleTime } from 'd3';
import { get } from 'object-path';
import { parseProjectDate, formatDate } from '../utils/date';
import { window } from 'global';

var ProjectTimeline = React.createClass({
  displayName: 'ProjectTimeline',

  propTypes: {
    project: React.PropTypes.object,
    meta: React.PropTypes.object,
    lang: React.PropTypes.string
  },

  render: function () {
    const project = this.props.project;

    const plannedStart = parseProjectDate(project.planned_start_date);
    const plannedEnd = parseProjectDate(project.planned_end_date);

    const actualStart = project.actual_start_date ? parseProjectDate(project.actual_start_date) : null;
    const actualEnd = project.actual_end_date
      ? parseProjectDate(project.actual_end_date)
      : new Date().getTime();

    const start = actualStart ? Math.min(plannedStart, actualStart) : plannedStart;
    const end = actualEnd ? Math.max(plannedEnd, actualEnd) : plannedEnd;

    const scale = scaleTime().domain([new Date(start), new Date(end)]).range([0, 100]);

    const { lang } = this.props;
    const t = get(window.t, [lang, 'project_pages'], {});

    return (
      <div className='timeline'>
        <div className='timeline__unit'>
          <h5 className='timeline__headline heading-alt'>{t.current_progress_title}</h5>
          {actualStart && actualEnd && timeline(actualStart, actualEnd, scale, lang)}
        </div>
        <div className='timeline__unit'>
          <h5 className='timeline__headline heading-alt'>{t.proposed_timeline_title}</h5>
          {timeline(plannedStart, plannedEnd, scale, lang)}
        </div>
      </div>
    );
  }
});

module.exports = ProjectTimeline;

function timeline (start, end, scale, lang) {
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
      <h5 className='timeline__label' style={{ left: left + '%' }}>{formatDate(start, lang)}</h5>
      <h5 className='timeline__label timeline__label--right' style={{ right: (100 - right) + '%' }}>{formatDate(end, lang)}</h5>
    </div>
  );
}
