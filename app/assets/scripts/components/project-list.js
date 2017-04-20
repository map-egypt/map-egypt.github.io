'use strict';
import React from 'react';
import { get } from 'object-path';
import _ from 'lodash';
import ProjectCard, { percentComplete } from './project-card';
import { window } from 'global';

const ProjectList = React.createClass({
  displayName: 'ProjectList',

  propTypes: {
    projects: React.PropTypes.array,
    meta: React.PropTypes.object,
    lang: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      showSort: false,
      sortAccessor: {
        name: 'Alphabetical',
        class: 'sort-alphabetical',
        func: (projects) => projects.sort((a, b) => a.name < b.name ? -1 : 1)
      }
    };
  },

  toggleSort: function () {
    this.setState({showSort: !this.state.showSort});
  },

  setSortAccessor: function (prop) {
    this.setState({
      sortAccessor: {
        name: prop.name,
        class: prop.class,
        func: prop.func
      },
      showSort: false
    });
  },

  render: function () {
    const { lang } = this.props;
    const { projects, meta } = this.props;
    const { sortAccessor } = this.state;
    const data = sortAccessor.func(projects.slice());

    const sortOptions = {
      alphabetical: {
        name: 'Alphabetical',
        class: 'sort-alphabetical',
        func: (projects) => projects.sort((a, b) => a.name < b.name ? -1 : 1)
      },
      completeUp: {
        name: 'Percent Complete',
        class: 'sort-ascending',
        func: (projects) => projects.sort((a, b) => percentComplete(a) < percentComplete(b) ? -1 : 1)
      },
      completeDown: {
        name: 'Percent Complete',
        class: 'sort-descending',
        func: (projects) => projects.sort((a, b) => percentComplete(a) > percentComplete(b) ? -1 : 1)
      }
    };

    const t = get(window.t, [lang, 'projects_list_view'], {});
    return (
    <div className='inpage__body'>
      <div className='inner'>
        <section className='inpage__section project-list'>
          <div className='section__header'>
            <h1 className='section__title'>{t.projects_title}</h1>
            <div className='sort'>
              <label className='heading--label'>{t.sort_by_title}:</label>
              <span className='dropdown__container'>
                <button className={`button button--medium button--secondary drop__toggle--caret ${this.state.sortAccessor.class}`}
                onClick={this.toggleSort}>{t[this.state.sortAccessor.class.replace('-', '_')]}</button>
                {this.state.showSort &&
                  <ul className='drop__menu drop--align-left button--secondary'>
                    {_.map(sortOptions, (option, name) => {
                      return (
                        <li
                          className={`drop__menu-item menu-item--wide ${option.class}`}
                          key={option.class}
                          onClick={() => this.setSortAccessor(option)}>
                            {t[option.class.replace('-', '_')]}
                        </li>
                      );
                    })}
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
    </div>);
  }
});

module.exports = ProjectList;
