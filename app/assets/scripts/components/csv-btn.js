'use strict';
import React from 'react';
import { get } from 'object-path';
import { window } from 'global';
import * as serialize from '../utils/serialize-csv';

const meta = 'data:text/csv;charset=utf-8,';

var CSVBtn = React.createClass({
  displayName: 'CSVBtn',

  propTypes: {
    lang: React.PropTypes.string,
    title: React.PropTypes.string,
    relatedProjects: React.PropTypes.array,
    project: React.PropTypes.object,
    chartData: React.PropTypes.array,
    summary: React.PropTypes.object,
    ministryActiveProjects: React.PropTypes.array
  },

  serialize: function () {
    let csv = '' + meta + (this.props.title || '');

    if (this.props.project) {
      let project = serialize.project(this.props.project, this.props.lang);
      csv += '\n\nProject Data\n\n';
      csv = csv.concat(serialize.serialize(project));
    }

    if (this.props.summary) {
      let summary = this.props.summary;
      csv += `\n\n${summary.title}\n\n`;
      summary = serialize.summary(summary.data, Object.keys(summary.data));
      csv = csv.concat(serialize.serialize(summary));
    }

    if (this.props.ministryActiveProjects) {
      let ministryActiveProjects = serialize.ministryActiveProjects(this.props.ministryActiveProjects);
      csv += '\n\nActive Project Status\n\n';
      csv = csv.concat(serialize.serialize(ministryActiveProjects));
    }

    this.props.chartData.forEach(d => {
      csv += '\n\n' + d.title + '\n\n';
      csv += serialize.serialize(serialize.chartData(d.data));
    });

    if (this.props.relatedProjects && this.props.relatedProjects.length) {
      let projects = serialize.relatedProjects(get(this.props, 'relatedProjects', []), this.props.lang);
      csv += '\n\nRelated Projects\n\n';
      csv = csv.concat(serialize.serialize(projects));
    }

    if (window.encodeURI && typeof window.encodeURI === 'function') {
      var encodedUri = window.encodeURI(csv);
      window.open(encodedUri);
    }
  },

  render: function () {
    const text = get(window.t, [this.props.lang, 'general_buttons', 'csv']);
    return (
      <button className='button button--medium button--primary button--download' onClick={this.serialize}>{text}</button>
    );
  }
});

module.exports = CSVBtn;
