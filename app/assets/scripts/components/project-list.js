'use strict';
import React from 'react';
import ProjectCard from './project-card';

const ProjectList = React.createClass({
  displayName: 'ProjectList',

  propTypes: {
    projects: React.PropTypes.array,
    meta: React.PropTypes.object
  },

  render: function () {
    const {projects, meta} = this.props;
    return <div className='inpage__body'>
      <div className='inner'>
        <section className='inpage__section project-list'>
          <div className='section__header'>
            <h1 className='section__title'>Projects</h1>
            <div className='sort'>
              <label className='heading--label'>Sort By:</label>
              <button className='button button--medium button--secondary drop__toggle--caret'>Category</button>
            </div>
          </div>
          <div className='section__content'>
            <ul className='projects-list'>
              {projects.map((p) => {
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

