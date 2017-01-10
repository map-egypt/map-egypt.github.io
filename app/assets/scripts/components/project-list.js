'use strict';
import React from 'react';
import ProjectCard from './project-card';

const ProjectList = React.createClass({
  displayName: 'ProjectList',

  propTypes: {
    projects: React.PropTypes.array,
    meta: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      showSort: false,
      sortAccessor: (d) => d.name
    };
  },

  toggleSort: function () {
    this.setState({showSort: !this.state.showSort});
  },

  setSortAccessor: function (prop) {
    this.setState({
      sortAccessor: prop,
      showSort: false
    });
  },

  render: function () {
    const {projects, meta} = this.props;
    const {sortAccessor} = this.state;
    const data = projects.slice().sort((a, b) => sortAccessor(a) < sortAccessor(b) ? -1 : 1);

    return <div className='inpage__body'>
      <div className='inner'>
        <section className='inpage__section project-list'>
          <div className='section__header'>
            <h1 className='section__title'>Projects</h1>
            <div className='sort'>
              <label className='heading--label'>Sort By:</label>
              <span className='dropdown__container'>
                <button className='button button--medium button--secondary drop__toggle--caret'
                onClick={this.toggleSort}>Alphabetical</button>
                {this.state.showSort &&
                  <ul className='drop__menu drop--align-left button--secondary'>
                    <li className='drop__menu-item'
                      onClick={() => this.setSortAccessor((d) => d.name)}
                      >Alphabetical</li>
                  </ul>
                }
              </span>
            </div>
          </div>
          <div className='section__content'>
            <ul className='projects-list'>
              {data.map((p) => {
                return (
                  <li key={p.id}
                    className='projects-list__card'>
                    <ProjectCard
                      lang={meta.lang}
                      project={p}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>;
  }
});

module.exports = ProjectList;

