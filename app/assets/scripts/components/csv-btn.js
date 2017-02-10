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
    donors: React.PropTypes.array,
    disbursement: React.PropTypes.array,
    budgets: React.PropTypes.array,
    completion: React.PropTypes.array,
    beneficiaries: React.PropTypes.array
  },

  serialize: function () {
    let csv = '' + meta + (this.props.title || '');

    if (this.props.project) {
      let project = serialize.project(this.props.project, this.props.lang);
      csv += '\n\nProject Data\n\n';
      csv = csv.concat(serialize.serialize(project));
    }

    if (this.props.relatedProjects && this.props.relatedProjects.length) {
      let projects = serialize.relatedProjects(get(this.props, 'relatedProjects', []), this.props.lang);
      csv += '\n\nRelated Projects\n\n';
      csv = csv.concat(serialize.serialize(projects));
    }

    if (this.props.donors && this.props.donors.length) {
      let donors = serialize.donors(this.props.donors);
      csv += '\n\nFunding By Donor (US Dollars)\n\n';
      csv = csv.concat(serialize.serialize(donors));
    }

    if (this.props.disbursement && this.props.disbursement.length) {
      let disbursement = serialize.disbursement(this.props.disbursement);
      csv += '\n\nDisbursement vs. Reach\n\n';
      csv = csv.concat(serialize.serialize(disbursement));
    }

    if (this.props.budgets && this.props.budgets.length) {
      let budgets = serialize.fundingByCat(this.props.budgets, this.props.lang);
      csv += '\n\nFunding By Category\n\n';
      csv = csv.concat(serialize.serialize(budgets));
    }

    if (this.props.completion && this.props.completion.length) {
      let completion = serialize.fundingByCat(this.props.completion, this.props.lang);
      csv += '\n\nPercentage Complete By Category\n\n';
      csv = csv.concat(serialize.serialize(completion));
    }

    if (this.props.beneficiaries && this.props.beneficiaries.length) {
      let beneficiaries = serialize.beneficiariesByCat(this.props.beneficiaries, this.props.lang);
      console.log(beneficiaries)
      csv += '\n\nBeneficiaries Reached By Category\n\n';
      csv = csv.concat(serialize.serialize(beneficiaries));
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
