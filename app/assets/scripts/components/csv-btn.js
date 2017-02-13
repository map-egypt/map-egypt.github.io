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
    beneficiaries: React.PropTypes.array,
    categorySummary: React.PropTypes.object,
    categoryFunds: React.PropTypes.array,
    categoryCompletion: React.PropTypes.array,
    categoryProjectCountCompare: React.PropTypes.array,
    categoryProjectFundsCompare: React.PropTypes.array,
    donorSummary: React.PropTypes.object,
    donorProjectFunding: React.PropTypes.array,
    ministrySummary: React.PropTypes.object,
    ministryActiveProjects: React.PropTypes.array,
    servedByProject: React.PropTypes.array,
    ownerSummary: React.PropTypes.object
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
      let budgets = serialize.chartData(this.props.budgets, this.props.lang);
      csv += '\n\nFunding By Category\n\n';
      csv = csv.concat(serialize.serialize(budgets));
    }

    if (this.props.completion && this.props.completion.length) {
      let completion = serialize.chartData(this.props.completion, this.props.lang);
      csv += '\n\nPercentage Complete By Category\n\n';
      csv = csv.concat(serialize.serialize(completion));
    }

    if (this.props.beneficiaries && this.props.beneficiaries.length) {
      let beneficiaries = serialize.chartData(this.props.beneficiaries, this.props.lang);
      csv += '\n\nBeneficiaries Reached By Category\n\n';
      csv = csv.concat(serialize.serialize(beneficiaries));
    }

    if (this.props.categorySummary) {
      let categorySummary = serialize.summary(this.props.categorySummary);
      csv += '\n\nCategory Summary\n\n';
      csv = csv.concat(serialize.serialize(categorySummary));
    }

    if (this.props.categoryFunds && this.props.categoryFunds.length) {
      let categoryFunds = serialize.chartData(this.props.categoryFunds);
      csv += '\n\nCategory Funding for Projects (US dollars)\n\n';
      csv = csv.concat(serialize.serialize(categoryFunds));
    }

    if (this.props.categoryCompletion && this.props.categoryCompletion.length) {
      let categoryCompletion = serialize.chartData(this.props.categoryCompletion);
      csv += '\n\nCategory Percentage Complete By Project\n\n';
      csv = csv.concat(serialize.serialize(categoryCompletion));
    }

    if (this.props.categoryProjectCountCompare && this.props.categoryProjectCountCompare.length) {
      let categoryProjectCounts = serialize.chartData(this.props.categoryProjectCountCompare);
      csv += '\n\nComparison of Number of Projects per Category\n\n';
      csv = csv.concat(serialize.serialize(categoryProjectCounts));
    }

    if (this.props.categoryProjectFundsCompare && this.props.categoryProjectFundsCompare.length) {
      let categoryProjectFunds = serialize.chartData(this.props.categoryProjectFundsCompare);
      csv += '\n\nComparison of Project Funding per Category (US dollars)\n\n';
      csv = csv.concat(serialize.serialize(categoryProjectFunds));
    }

    if (this.props.donorSummary) {
      let donorSummary = serialize.summary(this.props.donorSummary);
      csv += '\n\nDonor Summary\n\n';
      csv = csv.concat(serialize.serialize(donorSummary));
    }

    if (this.props.donorProjectFunding) {
      let donorProjectFunding = serialize.chartData(this.props.donorProjectFunding);
      csv += '\n\nDonor Project Funding\n\n';
      csv = csv.concat(serialize.serialize(donorProjectFunding));
    }

    if (this.props.ministrySummary) {
      let ministrySummary = serialize.ministryOwnerSummary(this.props.ministrySummary);
      csv += '\n\nMinistry Summary\n\n';
      csv = csv.concat(serialize.serialize(ministrySummary));
    }

    if (this.props.ministryActiveProjects) {
      let ministryActiveProjects = serialize.ministryActiveProjects(this.props.ministryActiveProjects);
      csv += '\n\nActive Project Status\n\n';
      csv = csv.concat(serialize.serialize(ministryActiveProjects));
    }

    if (this.props.servedByProject) {
      let servedByProject = serialize.chartData(this.props.servedByProject);
      csv += '\n\nNumber Served Per Project\n\n';
      csv = csv.concat(serialize.serialize(servedByProject));
    }

    if (this.props.ownerSummary) {
      let ownerSummary = serialize.ministryOwnerSummary(this.props.ownerSummary);
      csv += '\n\nOwner Summary\n\n';
      csv = csv.concat(serialize.serialize(ownerSummary));
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
