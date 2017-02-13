'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { parseProjectDate } from '../utils/date';
import slugify from '../utils/slugify';
import { tally, shortTally, pct, shortParagraph, ontimeLookup, currency } from '../utils/format';
import getLocation from '../utils/location';

function categoryLink (base, categoryName) {
  return path.resolve(base, 'category', slugify(categoryName));
}

function isOntime (project) {
  let plannedEnd = parseProjectDate(project.planned_end_date);
  let actualEnd = parseProjectDate(project.actual_end_date);
  let plannedStart = parseProjectDate(project.planned_start_date);
  let actualStart = parseProjectDate(project.actual_start_date);

  const projectDelayed = actualStart > plannedStart || (!actualStart && plannedStart && plannedStart < new Date().getTime());
  const projectExtended = (!actualEnd && plannedEnd && plannedEnd < new Date().getTime()) || (actualEnd > plannedEnd);
  // if projects are both delayed and extended, they should be classed as delayed
  if (!plannedStart) {
    return null;
  } else if (projectDelayed) {
    return 'delayed';
  } else if (projectExtended) {
    return 'extended';
  } else {
    return 'ontime';
  }
}

function percentComplete (project) {
  const end = project.actual_end_date || project.planned_end_date;
  const start = project.actual_start_date;
  if (!end || !start) {
    return 0;
  }
  const now = new Date().getTime();
  const endDate = parseProjectDate(end);
  if (now > endDate) {
    return 100;
  } else {
    let startDate = parseProjectDate(start);
    let period = endDate - startDate;
    let elapsed = now - startDate;
    return Math.round(elapsed / period * 100);
  }
}

var ProjectCard = React.createClass({
  displayName: 'ProjectCard',

  propTypes: {
    lang: React.PropTypes.string,
    project: React.PropTypes.object
  },

  render: function () {
    const { project, lang } = this.props;
    const ontime = isOntime(project);
    const statusClass = 'project--' + ontime;
    const basepath = '/' + lang;
    const funding = get(project, 'budget', []).reduce((a, b) => a + b.fund.amount, 0);
    let completion = pct(percentComplete(project));
    let projects = [];
    get(project, 'location', []).map((loc, i) => {
      const location = getLocation(loc, lang);
      if (location) {
        projects.push(location.display);
      }
    });

    return (
      <div className='project'>
        <article className={statusClass}>
          <div className='card__contents'>
            <header className='card__header'>
              <h1 className='card__title heading--xsmall'><Link to={path.resolve(basepath, 'projects', project.id)} className='link--deco' href=''>{project.name}</Link></h1>

              {completion && (
                <ul className='card-cmplt'>
                  <li style={{ width: completion }}><span>{completion} cmplt</span></li>
                </ul>
              )}
            </header>
            <div className='card__body'>
              <dl className='card-meta'>
                <dt className='card-meta__label'>Status</dt>
                <dd className={'card-meta__value card-meta__value--status ' + statusClass}>{ontimeLookup[ontime]}</dd>
                <dt className='card-meta__label'>Location</dt>
                <dd className='card-meta__value card-meta__value--location'>{projects.join(', ')}</dd>
              </dl>
              <p>{shortParagraph(project.description)}</p>
              <div className='card__categories'>
                {project.categories.map((c, i) => {
                  let key = c.en;
                  return (
                    <span key={key} className='card__subtitle'>
                      <Link to={categoryLink(basepath, key)} className='link--secondary' href=''>{c[lang]}</Link>
                    </span>
                  );
                })}
              </div>
              <ul className='card-stats'>
                <li>{currency(shortTally(funding))} <small>funding</small></li>
                <li>{tally(project.number_served.number_served)} <small>{project.number_served.number_served_unit.toLowerCase()}</small></li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    );
  }
});
module.exports = ProjectCard;
module.exports.isOntime = isOntime;
module.exports.percentComplete = percentComplete;
