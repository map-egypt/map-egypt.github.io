'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Share from '../components/share';
import Map from '../components/map';
import ProjectCard from '../components/project-card';
import slugify from '../utils/slugify';

var Owner = React.createClass({
  displayName: 'Owner',

  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  render: function () {
    const projects = get(this.props, 'api.projects', []);
    if (projects.length === 0) {
      return <div></div>; // TODO loading indicator
    }

    const ownerName = this.props.params.name;
    let ownerDisplayName;

    const lang = this.props.meta.lang;
    const ownerProjects = projects.filter((project) => {
      const name = project.local_manager[lang];
      const sluggedName = slugify(name);
      if (sluggedName === ownerName) {
        ownerDisplayName = name;
      }
      return sluggedName === ownerName;
    });

    const singleProject = ownerProjects.length <= 1 ? ' funding--single' : '';
    const activeProjects = ownerProjects.filter((project) => project.actual_end_date).length;

    return (
      <section className='inpage funding'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-actions'>
                <ul>
                  <li><button className='button button--medium button--primary button--download'>Download</button></li>
                  <li><Share path={this.props.location.pathname}/></li>
                </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{ownerDisplayName}</h1>
            </div>
          </div>
        </header>
        <div className={'inpage__body funding' + singleProject}>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>

              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
                <Map />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                <li> {activeProjects} <small>Active {activeProjects > 1 ? 'Projects' : 'Project'}</small></li>
                <li> {ownerProjects.length} <small>Total {ownerProjects.length > 1 ? 'Projects' : 'Project'}</small></li>
                </ul>
              </div>
            </section>
          </div>

          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--small'>Projects Contributed To</h1>
              <ul className='projects-list'>
                {ownerProjects.map((p) => {
                  return (
                    <li key={p.id} className='projects-list__card'>
                      <ProjectCard lang={this.props.meta.lang}
                        project={p} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(Owner);
